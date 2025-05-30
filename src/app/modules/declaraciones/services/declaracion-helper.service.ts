import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, combineLatest, forkJoin, map, Subject, distinctUntilChanged, mergeMap, of, Observable, shareReplay, exhaustMap, catchError, finalize } from 'rxjs';
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
  step?: number;
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
              // Nueva lógica de validación para subpasos
              const tieneRegistros = item.tiene !== 'No Tiene';
              const todosNoAplica = item.tiene === 'No Tiene';
              const registrosCompletos = !item.incompleto;

              const isCompleted = todosNoAplica || (tieneRegistros && registrosCompletos);

              subSteps.push({
                label,
                key: subKey,
                order: item.orden,
                completed: isCompleted,
                enabled: tieneRegistros,
                status: isCompleted ? 'completed' : 'incomplete',
                subSteps: [],
                step: parseInt(stepKey.replace('paso', ''))
              });
            }
          });
        }

        // Caso especial para paso-12 que no tiene subpasos en la API pero necesitamos mantener la estructura
        if (stepKey === 'paso12' && itemsStep.length > 0) {
          const mainItem = itemsStep[0];
          const tieneRegistros = mainItem.tiene !== 'No Tiene';
          const todosNoAplica = mainItem.tiene === 'No Tiene';
          const registrosCompletos = !mainItem.incompleto;

          const isCompleted = todosNoAplica || (tieneRegistros && registrosCompletos);

          subSteps.push({
            label: 'Contratos de Mandato Especial',
            key: 'paso12-1',
            order: mainItem.orden,
            completed: isCompleted,
            enabled: tieneRegistros,
            status: isCompleted ? 'completed' : 'incomplete',
            subSteps: [],
            step: parseInt(stepKey.replace('paso', ''))
          });
        }

        const mainItem = itemsStep[0];
        // Validar si todos los subpasos están completos
        const allSubStepsCompleted = subSteps.every(subStep => subStep.completed);

        intereses.push({
          label: mainItem.item.split(' - ')[0],
          key: stepKey,
          order: mainItem.orden,
          completed: allSubStepsCompleted,
          enabled: true,
          status: allSubStepsCompleted ? 'completed' : 'incomplete',
          component: `Paso${stepKey.replace('paso', '')}Component`,
          subSteps,
          step: parseInt(stepKey.replace('paso', ''))
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
const updateState = <T extends object>(obj: T, updates: Partial<T>): T => {
  return { ...obj, ...updates };
};


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

  private readonly activeNameSubject = new BehaviorSubject<any>(0);
  readonly activeName$ = this.activeNameSubject.asObservable();

  private readonly isCreatingFlag = new BehaviorSubject<any>(null);
  readonly isCreating$ = this.isCreatingFlag.asObservable();

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

  // Centralizar el estado base y compartirlo entre suscriptores
  private readonly baseState$ = this._state$.asObservable().pipe(
    shareReplay(1)
  );

  // Mantener Subject original para compatibilidad
  private readonly nextStepSubject = new Subject<void>();
  readonly nextStep$ = this.nextStepSubject.asObservable();

  private readonly nextStepTrigger = new Subject<void>();
  private readonly processedNextStep$ = this.nextStepTrigger.pipe(
    exhaustMap(() => this.processNextStep())
  );


  constructor(
    private _declaracion: DeclaracionService,
    private _declarante: DeclaranteService,
    private _datosLaborales: DatosLaboralesService,
    private _personaRelacionada: PersonaRelacionadaService,
  ) {
    // Suscripción al procesamiento del siguiente paso
    this.processedNextStep$.subscribe();
    // Suscripción al procesamiento del siguiente paso
    this.processedNextStep$.subscribe();

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

  setIsCreating(isCreating: boolean): void {
    if (this.isCreatingFlag.value !== isCreating) {
      this.isCreatingFlag.next(isCreating);
    }
  }

  get isCreating(): boolean {
    return this.isCreatingFlag.value;
  }

  private loadInitialData(declaracionId: number, declaranteId: number, preserveActiveDeclarante: boolean = false): void {
    // Si es una nueva declaración, inicializar el estado sin hacer llamadas al servidor
    if (declaracionId === 0) {
      const nuevoState = {
        declarante: this._state$.value.declarante,
        declaraciones: [],
        activeDeclaracionId: ''
      };
      this._state$.next(nuevoState);
      this.declaracionesFlagSubject.next(null);
      this.isCreatingFlag.next(true);
      return;
    }

    // Si es una declaración existente, proceder con la carga normal
    this.isCreatingFlag.next(false);

    // Emitir un estado inicial con progreso undefined para mostrar el loader
    const initialState = {
      ...this._state$.value,
      declaraciones: [] // Limpiar las declaraciones para forzar el estado de carga
    };
    this._state$.next(initialState);

    // Iniciar la carga de datos
    forkJoin([
      this._declaracion.confirmarDatos(declaracionId),
      this._declaracion.obtenerRegistro(declaranteId),
    ]).subscribe({
      next: ([confirm, registro]) => {
        this.declaracionesFlagSubject.next(registro);
        const nuevoState = buildFormState(confirm, registro);

        if (!preserveActiveDeclarante) {
          const mainDeclarante = nuevoState.declaraciones.find(d => d.esDeclarante);
          if (mainDeclarante) {
            nuevoState.activeDeclaracionId = mainDeclarante.id;
          }
        } else {
          nuevoState.activeDeclaracionId = this._state$.value.activeDeclaracionId;
        }

        this._state$.next(nuevoState);

        console.log("nuevoState", nuevoState)

        // Validar el progreso después de cargar los datos iniciales
        this.validateAndUpdateStepProgress(declaracionId, declaranteId);
      },
      error: (err) => {
        console.error('Error al cargar datos iniciales:', err);
        // En caso de error, mantener el estado actual
        this._state$.next(this._state$.value);
      },
    });
  }

  private validateAndUpdateStepProgress(declaracionId: number, declaranteId: number): void {
    forkJoin([
      this._declaracion.getDeclaracion(declaracionId),
      this._declarante.getDatosDeclarante(declaracionId),
      this._datosLaborales.getDatosLaborales(declaracionId),
      this._declaracion.obtenerAplica(declaracionId),
      this._personaRelacionada.listar(declaracionId)
    ]).subscribe({
      next: ([declaracion, datosDeclarante, datosLaborales, aplica, personasRelacionadas]) => {
        // Validar paso 1 - Datos de la Declaración
        if (declaracion &&
          declaracion.tipoDeclaracion &&
          declaracion.rbLugarDeclaracion !== undefined &&
          declaracion.region &&
          declaracion.comuna) {
          this.markStepCompleted(['declarante', 'paso1']);
        } else {
          this.markStepIncomplete(['declarante', 'paso1']);
        }

        // Validar paso 2 - Datos Personales
        if (datosDeclarante &&
          datosDeclarante.rut &&
          datosDeclarante.nombre &&
          datosDeclarante.apellidoPaterno &&
          datosDeclarante.apellidoMaterno &&
          datosDeclarante.profesionId &&
          datosDeclarante.calle &&
          datosDeclarante.estadoCivil &&
          datosDeclarante.regimenPatrimonialId) {
          this.markStepCompleted(['declarante', 'paso2']);
        } else {
          this.markStepIncomplete(['declarante', 'paso2']);
        }

        // Validar paso 3 - Datos de la Entidad
        if (datosLaborales?.data &&
          datosLaborales.data.ServPublicoId &&
          datosLaborales.data.cargoNombre &&
          datosLaborales.data.remuneracionTipo &&
          datosLaborales.data.ServGradoId &&
          datosLaborales.data.fechaAsuncion &&
          datosLaborales.data.rbLugarDesempeno !== undefined &&
          datosLaborales.data.regionId &&
          datosLaborales.data.comunaId) {
          console.log("paso3 completo")
          this.markStepCompleted(['declarante', 'paso3']);
        } else {
          console.log("paso3 incompleto")
          this.markStepIncomplete(['declarante', 'paso3']);
        }

        // Validar paso 4 - Hijos bajo Patria Potestad
        // Si no aplica o si tiene personas relacionadas válidas

        console.log(personasRelacionadas)
        console.log(aplica)
        if (!aplica.data || (personasRelacionadas.data && personasRelacionadas.length > 0)) {
          this.markStepCompleted(['declarante', 'paso4']);
        } else {
          this.markStepIncomplete(['declarante', 'paso4']);
        }

        // Actualizar el estado de creación basado en el progreso
        const allStepsComplete = this.isComplete('paso1') &&
          this.isComplete('paso2') &&
          this.isComplete('paso3') &&
          this.isComplete('paso4');

        // Solo actualizamos isCreating si es una nueva declaración
        if (declaracionId === 0) {
          this.setIsCreating(!allStepsComplete);
        }
      },
      error: (err) => console.error('Error validando progreso:', err)
    });
  }



  ngOnInit(): void {
    // this.getDeclaracionesFlag(1319527)
  }


  getConfirmacionDatos() {
    this._declaracion.confirmarDatos(this.declaranteId).subscribe({
      next: (res: any) => { },
      error: (err) => { }
    })
  }
  getDeclaracionesFlag(declaranteId: number): void {
    this._declaracion.obtenerRegistro(declaranteId).subscribe({
      next: (res: any) => {
        console.log('Flags obtenidos:', res);
        this.declaracionesFlagSubject.next(res);
        // Validar los pasos de intereses basados en los nuevos flags
        this.validateFlagsForInteresesSteps();
        this.getConfirmacionDatos();

      },
      error: (err: any) => {
        console.error('Error al obtener flags:', err);
      }
    });
  }



  /** El stepper (o cualquier componente) debe llamar a esto
   *  cada vez que cambia manualmente de pestaña               */
  setCurrentStep(key: string): void {
    if (this.currentStepKeySubject.value !== key) {
      this.currentStepKeySubject.next(key);
    }
  }


  /* ───── Eventos ("siguiente paso") ───── */
  private isNextStepInProgress = false;

  /* ───── Bloque activo: decl | int | vol ───── */
  private readonly blockSubject = new BehaviorSubject<'decl' | 'int' | 'vol'>('decl');
  readonly block$ = this.blockSubject.asObservable();

  // Hacer setActiveBlock como observable para facilitar la navegación entre bloques
  setActiveBlock(b: 'decl' | 'int' | 'vol'): void {
    console.log('Cambiando bloque activo a:', b);
    this.blockSubject.next(b);
  }

  /* ───── SELECTORES ───── */
  declaranteSteps$ = this.baseState$.pipe(map(s => s.declarante));
  interesesSteps$ = this.baseState$.pipe(
    map(s => {
      const declaracion = s.declaraciones.find(d => d.id === s.activeDeclaracionId);
      return declaracion?.intereses.filter(step => step.step && step.step < 14) ?? [];
    })
  );
  voluntariasSteps$ = this.baseState$.pipe(
    map(s => {
      const declaracion = s.declaraciones.find(d => d.id === s.activeDeclaracionId);
      return declaracion?.intereses.filter(step => step.step && step.step >= 14) ?? [];
    })
  );
  activeId$ = this.baseState$.pipe(map(s => s.activeDeclaracionId));
  declaraciones$ = this.baseState$.pipe(map(s => s.declaraciones));

  /** Progreso global (0‑1) */
  globalProgress$ = this.baseState$.pipe(
    map(st => {
      const allDeclarante = flatten(st.declarante);
      const allIntereses = st.declaraciones.flatMap(d => flatten(d.intereses.filter(step => step.step && step.step < 14)));
      const allVoluntarias = st.declaraciones.flatMap(d => flatten(d.intereses.filter(step => step.step && step.step >= 14)));
      const all = [...allDeclarante, ...allIntereses, ...allVoluntarias];
      return all.length ? all.filter(x => x.completed).length / all.length : 0;
    }),
    shareReplay(1)
  );

  /** Progreso declarante sólo */
  declProgress$ = this.baseState$.pipe(
    map(st => {
      const en = st.declarante.filter(p => p.enabled);
      return en.length ? en.filter(p => p.completed).length / en.length : 0;
    }),
    shareReplay(1)
  );

  /** Progreso intereses (declaración activa) */
  intProgress$ = this.baseState$.pipe(
    map(st => {
      const d = st.declaraciones.find(x => x.id === st.activeDeclaracionId);
      if (!d) { return 0; }
      const en = d.intereses.filter(p => p.enabled && p.step && p.step < 14);
      return en.length ? en.filter(p => p.completed).length / en.length : 0;
    }),
    shareReplay(1)
  );

  volProgress$ = this.baseState$.pipe(
    map(st => {
      const d = st.declaraciones.find(x => x.id === st.activeDeclaracionId);
      if (!d) { return 0; }
      const en = d.intereses.filter(p => p.enabled && p.step && p.step >= 14);
      return en.length ? en.filter(p => p.completed).length / en.length : 0;
    }),
    shareReplay(1)
  );

  /* ═════ MUTACIONES ═════ */

  /** Marca un paso/subpaso completo + burbujea al padre */
  markStepCompleted(path: string[]): void {
    const copy = updateState(this._state$.value, {});
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
    const copy = updateState(this._state$.value, {});
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
    const copy = updateState(this._state$.value, {});
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

      // Cargar los flags para el nuevo declarante activo
      const declaracion = state.declaraciones.find(d => d.id === id);
      if (declaracion) {
        this.getDeclaracionesFlag(declaracion.idDeclarante);
      }

    }
  }

  setActiveDeclarante(id: string): void {
    const state = this._state$.value;
    const declaracion: any = state.declaraciones.find(d => d.id === id);
    if (declaracion) {
      // Actualizar el ID del declarante activo
      this.activeDeclaranteSubject.next(declaracion.idDeclarante);
      this.activeNameSubject.next(declaracion.declara);

      // Actualizar el estado manteniendo el declarante activo
      this._state$.next({
        ...state,
        activeDeclaracionId: id
      });

      // Cargar los flags para el nuevo declarante activo
      this.getDeclaracionesFlag(declaracion.idDeclarante);

      // Cargar los flags para el nuevo declarante activo
      this.getDeclaracionesFlag(declaracion.idDeclarante);
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
    const copy = updateState(this._state$.value, {});
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

  resetState(): void {
    // Reiniciar el estado principal
    this._state$.next({
      declarante: [
        { label: 'Datos de la Declaración', key: 'paso1', order: 1, completed: false, enabled: true, component: 'Paso1DeclaracionComponent', status: 'pending', subSteps: [] },
        { label: 'Datos Personales', key: 'paso2', order: 2, completed: false, enabled: true, component: 'Paso2DatosPersonalesComponent', status: 'pending', subSteps: [] },
        { label: 'Datos de la Entidad', key: 'paso3', order: 3, completed: false, enabled: true, component: 'Paso3EntidadComponent', status: 'pending', subSteps: [] },
        { label: 'Hijos bajo Patria Potestad', key: 'paso4', order: 4, completed: false, enabled: true, component: 'Paso4TutelaComponent', status: 'pending', subSteps: [] }
      ],
      declaraciones: [],
      activeDeclaracionId: ''
    });

    // Reiniciar otros subjects
    this.activeDeclaracionSubject.next(0);
    this.activeDeclaranteSubject.next(0);
    this.isCreatingFlag.next(false);
    this.declaracionesFlagSubject.next(null);
    this.currentStepKeySubject.next('paso1');
    this.blockSubject.next('decl');
  }

  // Método para procesar el siguiente paso de manera asíncrona
  private processNextStep(): Observable<void> {
    console.log('=== Inicio nextStep ===');
    this.isNextStepInProgress = true;

    return of(null).pipe(
      map(() => {
        const st = this._state$.value;
        const activeKey = this.currentStepKeySubject.value;
        const currentBlock = this.blockSubject.value;

        console.log('Paso actual:', activeKey);
        console.log('Bloque actual:', currentBlock);

        const rootDecl = st.declarante.filter(p => p.enabled).sort((a, b) => a.order - b.order);
        const rootInt = (
          st.declaraciones.find(d => d.id === st.activeDeclaracionId)
            ?.intereses.filter(step => step.step && step.step < 14) ?? []
        ).filter(p => p.enabled).sort((a, b) => a.order - b.order);
        
        const rootVol = (
          st.declaraciones.find(d => d.id === st.activeDeclaracionId)
            ?.intereses.filter(step => step.step && step.step >= 14) ?? []
        ).filter(p => p.enabled).sort((a, b) => a.order - b.order);

        // Si estamos en el bloque de declarante
        if (currentBlock === 'decl') {
          const currentIdx = rootDecl.findIndex(p => p.key === activeKey);
          console.log('Índice actual en declarante:', currentIdx);

          // Verificar si hay un siguiente paso disponible
          if (currentIdx >= 0 && currentIdx < rootDecl.length - 1) {
            // Avanzar al siguiente paso del declarante
            const next = rootDecl[currentIdx + 1];
            console.log('Avanzando al siguiente paso:', next.key);
            this.currentStepKeySubject.next(next.key);
            this.nextStepSubject.next();
          }
          // Solo cambiar al bloque de intereses si estamos en el último paso del declarante (paso4)
          else if (currentIdx === rootDecl.length - 1 && rootInt.length > 0) {
            console.log('Cambiando a bloque de intereses desde el paso final del declarante');

            // Importante: primero cambiar el paso y luego el bloque para garantizar la sincronía
            const firstInt = rootInt[0];
            if (firstInt) {
              console.log('Estableciendo el paso activo a:', firstInt.key);
              this.currentStepKeySubject.next(firstInt.key);
            }

            // Cambiar el bloque activo a 'int' para mostrar la pestaña de intereses
            console.log('Cambiando el bloque activo a int');
            this.blockSubject.next('int');

            // Emitir la señal de nextStep
            this.nextStepSubject.next();
          }
        }
        // Si estamos en el bloque de intereses
        else if (currentBlock === 'int') {
          const currentIdx = rootInt.findIndex(p => p.key === activeKey);
          console.log('Índice actual en intereses:', currentIdx);

          if (currentIdx >= 0 && currentIdx < rootInt.length - 1) {
            const next = rootInt[currentIdx + 1];
            console.log('Avanzando al siguiente paso de intereses:', next.key);
            this.currentStepKeySubject.next(next.key);
            this.nextStepSubject.next();
          } else if (currentIdx === rootInt.length - 1 && rootVol.length > 0) {
            // Último paso de Intereses, transitar a Voluntarias
            console.log('Cambiando a bloque de declaraciones voluntarias');
            const firstVol = rootVol[0];
            if (firstVol) {
              this.currentStepKeySubject.next(firstVol.key);
            }
            this.blockSubject.next('vol');
            this.nextStepSubject.next();
          }
        }
        // Si estamos en el bloque de declaraciones voluntarias (nuevo)
        else if (currentBlock === 'vol') {
          const currentIdx = rootVol.findIndex(p => p.key === activeKey);
          console.log('Índice actual en voluntarias:', currentIdx);

          if (currentIdx >= 0 && currentIdx < rootVol.length - 1) {
            const next = rootVol[currentIdx + 1];
            console.log('Avanzando al siguiente paso de voluntarias:', next.key);
            this.currentStepKeySubject.next(next.key);
            this.nextStepSubject.next();
          }
          // Aquí podría ir lógica para ir a "Confirmación de Datos" si es necesario
        }
      }),
      catchError(error => {
        console.error('Error en nextStep:', error);
        return of(undefined);
      }),
      finalize(() => {
        console.log('=== Fin nextStep ===');
        this.isNextStepInProgress = false;
      })
    );
  }

  // Método público para activar la navegación al siguiente paso
  nextStep(): void {
    console.log('nextStep');
    if (this.isNextStepInProgress) {
      console.log('nextStep ya está en progreso, ignorando llamada duplicada');
      return;
    }
    this.nextStepTrigger.next();
    // También emitir en el subject original para mantener compatibilidad
    this.nextStepSubject.next();
  }

  /**
   * Verifica si hay al menos un flag de aplicabilidad de tabla como undefined en un paso
   * @param stepKey Clave del paso a verificar
   * @returns true si hay al menos un flag undefined, false en caso contrario
   */
  hasUndefinedFlags(stepKey: string): boolean {
    // Si no estamos en los pasos de intereses (5-16), no aplicamos esta validación
    if (!stepKey.startsWith('paso') || parseInt(stepKey.replace('paso', '')) < 5) {
      return false;
    }

    // Obtener las flags actuales
    const flags = this.declaracionesFlagSubject.value;
    if (!flags) {
      return true; // Si no hay flags disponibles, consideramos incompleto
    }

    // Mapeo de pasos a flags correspondientes
    const stepToFlags: Record<string, string[]> = {
      'paso5': ['actividadesIndividuales', 'actividadesDependientes'],
      'paso6': ['bienesInmuebles', 'bienesInmueblesExtranjero'],
      'paso7': ['aguas', 'concesiones'],
      'paso8': ['vehiculos', 'aeronaves', 'naves', 'bienMueble'],
      'paso9': ['sociedades', 'sociedadesExtranjero'],
      'paso10': ['instrumento', 'instrumentoExtranjero'],
      'paso11': ['cuentas', 'ahorros', 'depositos', 'seguros'], // Agregamos los flags para valores obligatorios
      'paso12': ['contratos'],
      'paso13': ['pasivos', 'pensiones'], // Agregamos el flag de pensiones
      'paso14': ['otraFuente'],
      'paso15': ['otrosBienes'],
      'paso16': ['otrosAntecedentes']
    };

    // Verificar las flags correspondientes al paso
    const flagsToCheck = stepToFlags[stepKey] || [];
    for (const flag of flagsToCheck) {
      if (flags[flag] === undefined) {
        console.log(`Flag ${flag} es undefined para el paso ${stepKey}`);
        return true;
      }
    }

    return false;
  }

  /**
   * Actualiza el estado de los pasos 5-16 basado en los flags de aplicabilidad
   * Esta función debe llamarse cuando se actualizan los flags o cuando se cambia de declarante
   */
  validateFlagsForInteresesSteps(): void {
    console.log('Validando flags para pasos de intereses');
    const state = this._state$.value;
    const activeDeclaracion = state.declaraciones.find(d => d.id === state.activeDeclaracionId);

    if (!activeDeclaracion) {
      return;
    }

    const updatedDeclaracion: Declaracion = {
      ...activeDeclaracion,
      intereses: activeDeclaracion.intereses.map(step => {
        // Solo aplicamos esta validación a los pasos 5-16
        if (!step.key.startsWith('paso') || parseInt(step.key.replace('paso', '')) < 5) {
          return step;
        }

        // Verificar si hay flags undefined para este paso
        const hasUndefinedFlag = this.hasUndefinedFlags(step.key);

        // Si hay al menos un flag undefined, marcamos el paso como incompleto
        if (hasUndefinedFlag) {
          return {
            ...step,
            completed: false,
            status: 'incomplete' as const
          };
        }

        return step;
      })
    };

    // Actualizar el estado
    this._state$.next({
      ...state,
      declaraciones: state.declaraciones.map(d =>
        d.id === state.activeDeclaracionId ? updatedDeclaracion : d
      )
    });
  }
}


