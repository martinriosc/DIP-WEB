import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, combineLatest, forkJoin, map, Subject, distinctUntilChanged } from 'rxjs';
import { DeclaracionService } from './declaracion.service';
import { DatosLaboralesService } from './datos-laborales.service';
import { DeclaranteService } from './declarante.service';
import { PersonaRelacionadaService } from './persona-relacionada.service';


/* ╔═ Interfaces de Dominio ────────────────────────────────────── */
export interface Step {
  label: string;
  key: string;
  order: number;
  completed: boolean;
  enabled: boolean;
  status: 'pending' | 'completed' | 'incomplete';
  component?: any;
  subSteps: Step[];
}

export interface StepData {
  label: string;
  key: string;
  completed: boolean;
  enabled: boolean;
  subSteps: StepData[];
  // Opcional: apunta a un componente Angular
  component?: any;
}

export interface Declaracion {
  id: string;
  declara: string;
  relacion: string;
  completed: boolean;
  aplica: boolean;
  intereses: Step[];
  esDeclarante: boolean;
  idDeclarante: number;
}

export interface FormState {
  declarante: Step[];
  declaraciones: Declaracion[];
  activeDeclaracionId: string;
}

const MAIN_STEP: Record<string, string> = {
  tabPnlActividadesProfesionales: 'paso5',
  tabPnlBienesInmuebles: 'paso6',
  tabPnlAguasConcesiones: 'paso7',
  tabPnlVehiculosBienMueble: 'paso8',
  tabPnlComunidades: 'paso9',
  tabPnlValoresInstrumentos: 'paso10',
  tabPnlValoresObligatorios: 'paso11',
  tabPnlContratosAdministracion: 'paso12',
  tabPnlPasivos: 'paso13',
  tabPnlOtraFuente: 'paso14',
  tabOtrosBienes: 'paso15',
  tabOtrosAntecedentes: 'paso16'
};

const SUB_STEP: Record<string, Record<string, string>> = {
  paso5: {
    'Actividades en que haya participado': 'paso5-1',
    'Actividades que realiza o en que participa': 'paso5-2',
    'Actividades Cónyuge o Conviviente Civil': 'paso5-3'
  },
  paso6: {
    'Bienes Inmuebles en Chile': 'paso6-1',
    'Bienes Inmuebles Extranjero': 'paso6-2'
  },
  paso7: {
    'Derechos de aprovechamiento de aguas': 'paso7-1',
    'Concesiones': 'paso7-2'
  },
  paso8: {
    'Vehículos Motorizados Livianos y Pesados': 'paso8-1',
    'Aeronaves': 'paso8-2',
    'Naves o Artefactos Navales': 'paso8-3',
    'Bienes Muebles registrables': 'paso8-4'
  },
  paso9: {
    'Derechos o acciones en Chile': 'paso9-1',
    'Derechos o acciones en el Extranjero': 'paso9-2'
  },
  paso10: {
    'Instrumento o Valor transable en Chile': 'paso10-1',
    'Instrumento o Valor transable en el Extranjero': 'paso10-2'
  },
  paso11: {
    'Cuentas y/o Libretas de Ahorro': 'paso11-1',
    'Ahorro Previsional Voluntario': 'paso11-2',
    'Depósitos a Plazo': 'paso11-3',
    'Seguros': 'paso11-4'
  },
  paso12: {
    'Contratos de Mandato Especial': 'paso12-1'
  },
  paso13: {
    'Deudas por pensión de alimentos': 'paso13-1',
    'Pasivos': 'paso13-2'
  },
  paso14: {
    'Otra Fuente': 'paso14-1'
  },
  paso15: {
    'Otros Bienes': 'paso15-1'
  },
  paso16: {
    'Otros Antecedentes': 'paso16-1'
  }
};

const FLAG_MAP = {
  actividadesIndividuales: 'paso5-1',
  actividadesDependientes: 'paso5-2',
  bienesInmuebles: 'paso6',
  bienesInmueblesExtranjero: 'paso6-2',
  aguas: 'paso7-1',
  concesiones: 'paso7-2',
  vehiculos: 'paso8-1',
  aeronaves: 'paso8-2',
  naves: 'paso8-3',
  bienMueble: 'paso8-4',
  sociedades: 'paso9-1',
  sociedadesExtranjero: 'paso9-2',
  instrumento: 'paso10-1',
  instrumentoExtranjero: 'paso10-2',
  contratos: 'paso12',
  pasivos: 'paso13',
  otraFuente: 'paso14',
  otrosBienes: 'paso15',
  otrosAntecedentes: 'paso16'
} as const;

function buildFormState(api: any, flags: any): FormState {
  const state: FormState = {
    declarante: [
      { label: 'Datos de la Declaración', key: 'paso1', order: 1, completed: false, enabled: true, component: 'Paso1DeclaracionComponent', status: 'pending', subSteps: [] },
      { label: 'Datos Personales', key: 'paso2', order: 2, completed: false, enabled: true, component: 'Paso2DatosPersonalesComponent', status: 'pending', subSteps: [] },
      { label: 'Datos de la Entidad', key: 'paso3', order: 3, completed: false, enabled: true, component: 'Paso3EntidadComponent', status: 'pending', subSteps: [] },
      { label: 'Hijos bajo Patria Potestad', key: 'paso4', order: 4, completed: false, enabled: true, component: 'Paso4TutelaComponent', status: 'pending', subSteps: [] }
    ],
    declaraciones: [],
    activeDeclaracionId: ''
  };

  /* Agrupar ítems por persona -------------------------------- */
  const grupos = new Map<number, any[]>();
  api.items.forEach((it: any) => {
    const grupo = grupos.get(it.idDeclarante) || [];
    grupo.push(it);
    grupos.set(it.idDeclarante, grupo);
  });

  /* Crear declaraciones dinámicamente ------------------------ */
  state.declaraciones = Array.from(grupos.entries()).map(([idDecl, lista], idx) => {
    /* 2.1 Cuáles pasos/sub‑pasos llegaron realmente */
    const pasoRecibido = new Set<string>();
    lista.forEach(it => {
      const p = MAIN_STEP[it.idMenu];
      const s = SUB_STEP[p]?.[it.item.trim()];
      if (p) pasoRecibido.add(p);
      if (s) pasoRecibido.add(s);
    });

    /* 2.2 Construir pasos de intereses */
    const intereses: Step[] = [];
    Object.entries(MAIN_STEP).forEach(([menuId, stepKey]) => {
      const itemsStep = lista.filter(it => it.idMenu === menuId);
      if (itemsStep.length > 0) {
        const subSteps: Step[] = [];
        const subStepMap = SUB_STEP[stepKey];
        
        if (subStepMap) {
          Object.entries(subStepMap).forEach(([label, subKey]) => {
            const item = itemsStep.find(it => it.item.trim() === label);
            if (item) {
              subSteps.push({
                label,
                key: subKey,
                order: item.orden,
                completed: !item.incompleto,
                enabled: item.tiene !== 'No Tiene',
                status: !item.incompleto ? 'completed' : item.incompleto ? 'incomplete' : 'pending',
                subSteps: []
              });
            }
          });
        }

        // Caso especial para paso-12 que no tiene subpasos en la API pero necesitamos mantener la estructura
        if (stepKey === 'paso12' && itemsStep.length > 0) {
          const mainItem = itemsStep[0];
          subSteps.push({
            label: 'Contratos de Mandato Especial',
            key: 'paso12-1',
            order: mainItem.orden,
            completed: !mainItem.incompleto,
            enabled: mainItem.tiene !== 'No Tiene',
            status: !mainItem.incompleto ? 'completed' : mainItem.incompleto ? 'incomplete' : 'pending',
            subSteps: []
          });
        }

        const mainItem = itemsStep[0];
        intereses.push({
          label: mainItem.item.split(' - ')[0],
          key: stepKey,
          order: mainItem.orden,
          completed: !mainItem.incompleto,
          enabled: true,
          status: !mainItem.incompleto ? 'completed' : mainItem.incompleto ? 'incomplete' : 'pending',
          component: `Paso${stepKey.replace('paso', '')}Component`,
          subSteps
        });
      }
    });

    /* 2.3 Ordenar pasos y subpasos */
    intereses.sort((a, b) => a.order - b.order);
    intereses.forEach(step => {
      step.subSteps.sort((a, b) => a.order - b.order);
    });

    const first = lista[0];
    return <Declaracion>{
      id: `decl-${idx + 1}`,
      declara: first.nombreDeclarante.trim(),
      relacion: first.tipo.startsWith('Declarante') ? '' :
        first.tipo.startsWith('Cónyuge') ? 'Cónyuge' :
          'Persona Relacionada',
      idDeclarante: idDecl,
      esDeclarante: !!first.esDeclarante,
      completed: intereses.every(p => p.completed),
      intereses
    };
  });

  // Establecer el declarante principal como activo
  const mainDeclarante = state.declaraciones.find(d => d.esDeclarante);
  if (mainDeclarante) {
    state.activeDeclaracionId = mainDeclarante.id;
  }
  return state;
}

/* Aplica flags de habilitación/inhabilitación --------------- */
function applyFlags(intereses: Step[], flags: any): void {
  Object.entries(FLAG_MAP).forEach(([flagKey, stepKey]) => {
    const step = findStep(intereses, stepKey);
    if (step && flagKey in flags) {
      step.enabled = !!flags[flagKey as keyof typeof FLAG_MAP];
    }
  });
}




/* ╔═ Helpers PUROS (sin Subjects) ─────────────────────────────── */
const structured = <T>(obj: T) => structuredClone(obj) as T;

function flatten(steps: Step[]): Step[] {
  return steps.flatMap(s => [s, ...(s.subSteps ? flatten(s.subSteps) : [])]);
}

function findStep(arr: Step[], key: string): Step | undefined {
  for (const s of arr) {
    if (s.key === key) { return s; }
    const found = s.subSteps?.length ? findStep(s.subSteps, key) : undefined;
    if (found) { return found; }
  }
  return undefined;
}

function bubbleCompletion(steps: Step[]): void {
  steps.forEach(s => {
    if (s.subSteps?.length) {
      bubbleCompletion(s.subSteps);
      s.completed = s.subSteps.every(c => c.completed);
    }
  });
}

@Injectable({
  providedIn: 'root'
})
export class DeclaracionHelperService {
  /* IDs activos (nunca string) */
  private readonly activeDeclaracionSubject = new BehaviorSubject<any>(
    0
  );
  readonly activeDeclaracion$ = this.activeDeclaracionSubject.asObservable();

  private readonly activeDeclaranteSubject = new BehaviorSubject<any>(
    0
  );
  readonly activeDeclarante$ = this.activeDeclaranteSubject.asObservable();

  /* Flags / Steps (sin cambios de lógica) */
  private readonly declaracionesFlagSubject = new BehaviorSubject<any>(null);
  declaracionesFlag$ = this.declaracionesFlagSubject.asObservable();

  private readonly stepsSubject = new BehaviorSubject<StepData[]>([]);
  steps$ = this.stepsSubject.asObservable();

  /* Fuente de verdad del formulario */
  private readonly _state$ = new BehaviorSubject<FormState>({
    declarante: [
      { label: 'Datos de la Declaración', key: 'paso1', order: 1, completed: false, enabled: true, component: 'Paso1DeclaracionComponent', status: 'pending', subSteps: [] },
      { label: 'Datos Personales', key: 'paso2', order: 2, completed: false, enabled: true, component: 'Paso2DatosPersonalesComponent', status: 'pending', subSteps: [] },
      { label: 'Datos de la Entidad', key: 'paso3', order: 3, completed: false, enabled: true, component: 'Paso3EntidadComponent', status: 'pending', subSteps: [] },
      { label: 'Hijos bajo Patria Potestad', key: 'paso4', order: 4, completed: false, enabled: true, component: 'Paso4TutelaComponent', status: 'pending', subSteps: [] }
    ],
    declaraciones: [],
    activeDeclaracionId: ''
  });
  readonly state$ = this._state$.asObservable();

  /* Stream del paso actual (sin cambios) */
  private readonly currentStepKeySubject = new BehaviorSubject<string>('paso1');
  readonly currentStepKey$ = this.currentStepKeySubject.asObservable();

  constructor(
    private _declaracion: DeclaracionService,
    private _declarante: DeclaranteService,
    private _datosLaborales: DatosLaboralesService,
    private _personaRelacionada: PersonaRelacionadaService,
  ) {
    // Cargar datos iniciales
    this.loadInitialData(this.declaracionId, this.declaranteId);

    combineLatest([
      this.activeDeclaracion$,
      this.activeDeclarante$,
    ])
      .pipe(
        filter(
          ([decId, declId]) => decId !== null && declId !== null
        ),
        distinctUntilChanged(
          (a, b) => a[0] === b[0] && a[1] === b[1]
        )
      )
      .subscribe(([declaracionId, declaranteId]) =>
        this.loadInitialData(declaracionId!, declaranteId!, true)
      );
  }

  /* ══════ SETTERS / GETTERS de ID ══════ */
  setDeclaracionId(id: number): void {
    if (this.activeDeclaracionSubject.value !== id) {
      this.activeDeclaracionSubject.next(id);
    }
  }
  get declaracionId(): number {
    return this.activeDeclaracionSubject.value;
  }

  setDeclaranteId(id: number): void {
    if (this.activeDeclaranteSubject.value !== id) {
      this.activeDeclaranteSubject.next(id);
    }
  }
  get declaranteId(): number {
    return this.activeDeclaranteSubject.value;
  }

  private loadInitialData(
    declaracionId: number,
    declaranteId: number,
    preserveActiveDeclarante: boolean = false
  ): void {
    forkJoin([
      this._declaracion.confirmarDatos(declaracionId),
      this._declaracion.obtenerRegistro(declaranteId),
    ]).subscribe({
      next: ([confirm, registro]) => {
        console.log(registro)
        this.declaracionesFlagSubject.next(registro);

        const nuevoState = buildFormState(confirm, registro);
        
        // Solo establecer el declarante principal como activo si no estamos preservando el activo
        if (!preserveActiveDeclarante) {
          const mainDeclarante = nuevoState.declaraciones.find(d => d.esDeclarante);
          if (mainDeclarante) {
            nuevoState.activeDeclaracionId = mainDeclarante.id;
          }
        } else {
          // Mantener el declarante activo actual
          nuevoState.activeDeclaracionId = this._state$.value.activeDeclaracionId;
        }

        this._state$.next(nuevoState);

        /* Validar pasos del declarante con los nuevos IDs */
        this.validarPasosDeclarante(declaranteId, declaracionId);
      },
      error: (err) => {
        console.error('Error al cargar datos iniciales:', err);
      },
    });
  }


  validarPasosDeclarante(declaranteId: number, declaracionId: number) {
    this._declaracion.obtenerRegistro(declaranteId).subscribe({
      next: (res) => {
        if (res) {
          this.markStepCompleted(['declarante', 'paso1'])
        }
      }
    })

    this._declarante.getDatosDeclarante(declaracionId).subscribe({
      next: (res) => {
        if (res) {
          this.markStepCompleted(['declarante', 'paso2'])
        }
      }
    })

    this._datosLaborales.getDatosLaborales(declaracionId).subscribe({
      next: (res) => {
        if (res) {
          this.markStepCompleted(['declarante', 'paso3'])
        }
      }
    })

    this._declaracion.obtenerAplica(declaracionId).subscribe({
      next: (res) => {
        if (res) {
          this._personaRelacionada.listar(declaracionId).subscribe({
            next: (res: any) => {
              if (res.length > 0) {
                this.markStepCompleted(['declarante', 'paso4'])
              }
            }
          })
        } else {
          this.markStepCompleted(['declarante', 'paso4'])
        }
      }
    })
  }


  ngOnInit(): void {
    // this.getDeclaracionesFlag(1319527)
  }


  getConfirmacionDatos() {
    this._declaracion.confirmarDatos(this.declaranteId).subscribe({
      next: (res: any) => {},
      error: (err) => {}
    })
  }
  getDeclaracionesFlag(declaranteId: number) {
    this._declaracion.obtenerRegistro(declaranteId).subscribe({
      next: (res) => {
        this.declaracionesFlagSubject.next(res)
        this.getConfirmacionDatos()
      },
      error: (err) => {}
    })
  }



  /** El stepper (o cualquier componente) debe llamar a esto
   *  cada vez que cambia manualmente de pestaña               */
  setCurrentStep(key: string): void {
    if (this.currentStepKeySubject.value !== key) {
      this.currentStepKeySubject.next(key);
    }
  }


  /* ───── Eventos (“siguiente paso”) ───── */
  private readonly nextStepSubject = new Subject<void>();
  readonly nextStep$ = this.nextStepSubject.asObservable();


  activeDeclaranteName$ = this.state$.pipe(
    map(st => st.declaraciones
      .find(d => d.id === st.activeDeclaracionId)
      ?.declara ?? '')
  );

  nextStep(): void {
    const st = this._state$.value;
    const activeKey = this.currentStepKeySubject.value;
    const currentBlock = this.blockSubject.value;

    const rootDecl = st.declarante.filter(p => p.enabled).sort((a, b) => a.order - b.order);
    const rootInt = (
      st.declaraciones.find(d => d.id === st.activeDeclaracionId)
        ?.intereses ?? []
    ).filter(p => p.enabled).sort((a, b) => a.order - b.order);

    // Si estamos en el bloque de declarante
    if (currentBlock === 'decl') {
      const currentIdx = rootDecl.findIndex(p => p.key === activeKey);
      if (currentIdx >= 0) {
        // Si no es el último paso del declarante
        if (currentIdx < rootDecl.length - 1) {
          const next = rootDecl[currentIdx + 1];
          this.currentStepKeySubject.next(next.key);
          this.nextStepSubject.next();
        } 
        // Si es el último paso del declarante y hay pasos de intereses
        else if (rootInt.length > 0) {
          this.blockSubject.next('int');
          const firstInt = rootInt[0];
          this.currentStepKeySubject.next(firstInt.key);
          this.nextStepSubject.next();
        }
      }
    } 
    // Si estamos en el bloque de intereses
    else {
      const currentIdx = rootInt.findIndex(p => p.key === activeKey);
      if (currentIdx >= 0) {
        // Si no es el último paso de intereses
        if (currentIdx < rootInt.length - 1) {
          const next = rootInt[currentIdx + 1];
          this.currentStepKeySubject.next(next.key);
          this.nextStepSubject.next();
        }
        // Si es el último paso de intereses, no hacemos nada (iría a confirmación)
      } else {
        // Si no encontramos el paso actual en rootInt, significa que acabamos de cambiar al bloque
        // y debemos mantener el paso actual seleccionado
        const currentStep = rootInt.find(p => p.key === activeKey);
        if (currentStep) {
          this.currentStepKeySubject.next(currentStep.key);
          this.nextStepSubject.next();
        }
      }
    }
  }

  /* ───── Bloque activo: decl | int ───── */
  private readonly blockSubject = new BehaviorSubject<'decl' | 'int'>('decl');
  readonly block$ = this.blockSubject.asObservable();
  setActiveBlock(b: 'decl' | 'int'): void { this.blockSubject.next(b); }

  /* ───── SELECTORES ───── */
  declaranteSteps$ = this.state$.pipe(map(s => s.declarante));
  interesesSteps$ = this.state$.pipe(
    map(s => s.declaraciones.find(d => d.id === s.activeDeclaracionId)?.intereses ?? [])
  );
  activeId$ = this.state$.pipe(map(s => s.activeDeclaracionId));
  declaraciones$ = this.state$.pipe(map(s => s.declaraciones));

  /** Progreso global (0‑1) */
  globalProgress$ = this.state$.pipe(map(st => {
    const all = [
      ...flatten(st.declarante),
      ...st.declaraciones.flatMap(d => flatten(d.intereses))
    ];
    return all.length ? all.filter(x => x.completed).length / all.length : 0;
  }));
  /** Progreso declarante sólo */
  declProgress$ = this.state$.pipe(map(st => {
    const en = st.declarante.filter(p => p.enabled);
    return en.length ? en.filter(p => p.completed).length / en.length : 0;
  }));
  /** Progreso intereses (declaración activa) */
  intProgress$ = this.state$.pipe(map(st => {
    const d = st.declaraciones.find(x => x.id === st.activeDeclaracionId);
    if (!d) { return 0; }
    const en = d.intereses.filter(p => p.enabled);
    return en.length ? en.filter(p => p.completed).length / en.length : 0;
  }));

  /* ═════ MUTACIONES ═════ */

  /** Marca un paso/subpaso completo + burbujea al padre */
  markStepCompleted(path: string[]): void {
    const copy = structured(this._state$.value);
    const step = this.locateStep(copy, path);
    if (!step) { return; }
    step.completed = true;
    step.status = 'completed';
    bubbleCompletion(copy.declarante);
    copy.declaraciones.forEach(d => {
      bubbleCompletion(d.intereses);
      d.completed = d.intereses.every(s => s.completed);
    });
    this._state$.next(copy);
  }

  /** Marca como incompleto */
  markStepIncomplete(path: string[]): void {
    const copy = structured(this._state$.value);
    const step = this.locateStep(copy, path);
    if (!step) { return; }
    step.completed = false;
    step.status = 'incomplete';
    bubbleCompletion(copy.declarante);
    copy.declaraciones.forEach(d => {
      bubbleCompletion(d.intereses);
      d.completed = d.intereses.every(s => s.completed);
    });
    this._state$.next(copy);
  }

  /** Habilita / deshabilita un Paso (útil para lógica condicional) */
  toggleEnabled(path: string[], flag: boolean): void {
    const copy = structured(this._state$.value);
    const step = this.locateStep(copy, path);
    if (step) { step.enabled = flag; this._state$.next(copy); }
  }

  /** Cambia la declaración activa mostrada en el segundo stepper */
  setActiveDeclaracion(id: string): void {
    const state = this._state$.value;
    if (state.activeDeclaracionId !== id) {
      this._state$.next({
        ...state,
        activeDeclaracionId: id
      });
    }
  }

  setActiveDeclarante(id: string): void {
    const state = this._state$.value;
    const declaracion = state.declaraciones.find(d => d.id === id);
    if (declaracion) {
      // Actualizar el ID del declarante activo
      this.activeDeclaranteSubject.next(declaracion.idDeclarante);
      
      // Actualizar el estado manteniendo el declarante activo
      this._state$.next({
        ...state,
        activeDeclaracionId: id
      });
    }
  }

  initializeWithMainDeclarante(): void {
    const state = this._state$.value;
    const mainDeclarante = state.declaraciones.find(d => d.esDeclarante);
    if (mainDeclarante) {
      this.setActiveDeclaracion(mainDeclarante.id);
      this.setActiveDeclarante(mainDeclarante.id);
    }
  }

  refreshDeclaranteSteps(): void {
    const state = this._state$.value;
    const declaracion = state.declaraciones.find(d => d.id === state.activeDeclaracionId);
    if (declaracion) {
      // Solo actualizamos la declaración activa, manteniendo los pasos del declarante sin cambios
      this._state$.next({
        ...state,
        declaraciones: state.declaraciones.map(d =>
          d.id === state.activeDeclaracionId ? declaracion : d
        )
      });
    }
  }

  /* ═════ HELPERS PRIVADOS ═════ */

  private locateStep(state: FormState, path: string[]): Step | undefined {
    if (!path.length) { return undefined; }
    const [head, ...rest] = path;

    if (head === 'declarante') {
      return this.findInArray(state.declarante, rest);
    }

    if (head === 'declaraciones') {
      const [id, ...tail] = rest;
      const dec = state.declaraciones.find(d => d.id === id);
      return dec ? this.findInArray(dec.intereses, tail) : undefined;
    }
    return undefined;
  }

  private findInArray(arr: Step[], rest: string[]): Step | undefined {
    if (!rest.length) { return undefined; }
    const [key, ...tail] = rest;
    const found = arr.find(s => s.key === key);
    return tail.length ? this.findInArray(found?.subSteps ?? [], tail) : found;
  }

  /* ═════ API DE UTILIDAD SIMPLE (no necesita path) ═════ */

  /** Busca por key en todo el árbol (más cómodo para componentes pequeños) */
  setCompletedByKey(key: string, val = true): void {
    const copy = structured(this._state$.value);
    const step =
      findStep(copy.declarante, key) ??
      copy.declaraciones.flatMap(d => d.intereses)
        .map(int => findStep([int], key)).find(Boolean);
    if (step) {
      step.completed = val;
      step.status = val ? 'completed' : 'incomplete';
      bubbleCompletion(copy.declarante);
      copy.declaraciones.forEach(d => {
        bubbleCompletion(d.intereses);
        d.completed = d.intereses.every(s => s.completed);
      });
      this._state$.next(copy);
    }
  }

  /** Devuelve TRUE si el paso (o subpaso) está completo */
  isComplete(key: string): boolean {
    const st = this._state$.value;
    return !!findStep(st.declarante, key)?.completed ||
      !!st.declaraciones.find(d => findStep(d.intereses, key)?.completed);
  }

  /** Porcentaje global 0‑100 (método sincrónico) */
  getCompletionPercentage(): number {
    const st = this._state$.value;
    const all = [
      ...flatten(st.declarante),
      ...st.declaraciones.flatMap(d => flatten(d.intereses))
    ];
    return all.length ? Math.round(all.filter(x => x.completed).length / all.length * 100) : 0;
  }
}


