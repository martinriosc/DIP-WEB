import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Subject } from 'rxjs';
import { StepData } from './validador-declaracion.service';
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
  /** Pasos 1‑4 (Declarante) */
  declarante: Step[];
  /** Lista de declaraciones (1…n) */
  declaraciones: Declaracion[];
  /** Id de la declaración actualmente visible en el segundo stepper */
  activeDeclaracionId: string;
}

export const initialState: any = {

  /* ---------- PASOS 1 ⇢ 4 (DECLARANTE) ---------- */
  declarante: [
    { label: 'Datos de la Declaración', key: 'paso1', order: 1, completed: false, enabled: true, component: 'Paso1DeclaracionComponent', status: 'pending' },
    { label: 'Datos Personales', key: 'paso2', order: 2, completed: false, enabled: true, component: 'Paso2DatosPersonalesComponent', status: 'pending' },
    { label: 'Datos de la Entidad', key: 'paso3', order: 3, completed: false, enabled: true, component: 'Paso3EntidadComponent', status: 'pending' },
    { label: 'Hijos bajo Patria Potestad', key: 'paso4', order: 4, completed: false, enabled: true, component: 'Paso4TutelaComponent', status: 'pending' }
  ],

  /* ---------- DECLARACIONES (uno o más) ---------- */
  declaraciones: [

    /* =====  1)  Christian Contardo  (pasos 5‑16)  ===== */
    {
      id: 'decl-1',
      declara: 'Christian Contardo',
      relacion: '',
      completed: false,
      intereses: [

        {
          label: 'Actividades', key: 'paso5', order: 5, completed: false, enabled: true, status: 'pending',
          component: 'Paso5ActividadesComponent', subSteps: [
            { label: 'Participó últimos 12 meses', key: 'paso5-1', order: 51, completed: false, enabled: true, status: 'pending' },
            { label: 'Actividades actuales', key: 'paso5-2', order: 52, completed: false, enabled: true, status: 'pending' },
            { label: 'Actividades Cónyuge/Conv. Civil', key: 'paso5-3', order: 53, completed: false, enabled: true, status: 'pending' }
          ]
        },

        {
          label: 'Bienes Inmuebles', key: 'paso6', order: 6, completed: false, enabled: true, status: 'pending',
          component: 'Paso6BienesInmueblesComponent', subSteps: [
            { label: 'Situado en Chile', key: 'paso6-1', order: 61, completed: false, enabled: true, status: 'pending' },
            { label: 'Situado en el Exterior', key: 'paso6-2', order: 62, completed: false, enabled: true, status: 'pending' }
          ]
        },

        {
          label: 'Derechos de Aprovechamiento de Aguas', key: 'paso7', order: 7, completed: false, enabled: true, status: 'pending',
          component: 'Paso7DerechosAguasComponent', subSteps: [
            { label: 'Derecho de Aguas', key: 'paso7-1', order: 71, completed: false, enabled: true, status: 'pending' },
            { label: 'Concesiones', key: 'paso7-2', order: 72, completed: false, enabled: true, status: 'pending' }
          ]
        },

        {
          label: 'Bienes Muebles Registrables', key: 'paso8', order: 8, completed: false, enabled: true, status: 'pending',
          component: 'Paso8BienesMueblesComponent', subSteps: [
            { label: 'Vehículos Motorizados', key: 'paso8-1', order: 81, completed: false, enabled: true, status: 'pending' },
            { label: 'Aeronaves', key: 'paso8-2', order: 82, completed: false, enabled: true, status: 'pending' },
            { label: 'Naves o Artefactos Navales', key: 'paso8-3', order: 83, completed: false, enabled: true, status: 'pending' },
            { label: 'Otros Bienes Registrables', key: 'paso8-4', order: 84, completed: false, enabled: true, status: 'pending' }
          ]
        },

        {
          label: 'Derechos o Acciones en Entidades', key: 'paso9', order: 9, completed: false, enabled: true, status: 'pending',
          component: 'Paso9DerechosAccionesComponent', subSteps: [
            { label: 'Constituidas en Chile', key: 'paso9-1', order: 91, completed: false, enabled: true, status: 'pending' },
            { label: 'Constituidas en Exterior', key: 'paso9-2', order: 92, completed: false, enabled: true, status: 'pending' }
          ]
        },

        {
          label: 'Valores (Instrumentos Financieros)', key: 'paso10', order: 10, completed: false, enabled: true, status: 'pending',
          component: 'Paso10ValoresComponent', subSteps: [
            { label: 'Transables en Chile', key: 'paso10-1', order: 101, completed: false, enabled: true, status: 'pending' },
            { label: 'Transables en Exterior', key: 'paso10-2', order: 102, completed: false, enabled: true, status: 'pending' }
          ]
        },

        {
          label: 'Valores Obligatorios Adicionales', key: 'paso11', order: 11, completed: false, enabled: true, status: 'pending',
          component: 'Paso11ValoresObligatoriosComponent', subSteps: [
            { label: 'Cuentas / Libretas Ahorro', key: 'paso11-1', order: 111, completed: false, enabled: true, status: 'pending' },
            { label: 'Ahorro Previsional Vol.', key: 'paso11-2', order: 112, completed: false, enabled: true, status: 'pending' },
            { label: 'Depósitos a Plazo', key: 'paso11-3', order: 113, completed: false, enabled: true, status: 'pending' },
            { label: 'Seguros', key: 'paso11-4', order: 114, completed: false, enabled: true, status: 'pending' }
          ]
        },

        {
          label: 'Mandato Especial de Administración de Valores', key: 'paso12', order: 12, completed: false, enabled: true, status: 'pending',
          component: 'Paso12MandatoEspecialComponent', subSteps: []
        },

        {
          label: 'Pasivos', key: 'paso13', order: 13, completed: false, enabled: true, status: 'pending',
          component: 'Paso13PasivosComponent', subSteps: [
            { label: 'Deuda por pensión de alimentos', key: 'paso13-1', order: 131, completed: false, enabled: true, status: 'pending' },
            { label: 'Pasivos', key: 'paso13-2', order: 132, completed: false, enabled: true, status: 'pending' },
            { label: 'Deuda > 100 UTM', key: 'paso13-3', order: 133, completed: false, enabled: true, status: 'pending' }
          ]
        },

        {
          label: 'Otra Fuente de Conflicto de Interés', key: 'paso14', order: 14, completed: false, enabled: true, status: 'pending',
          component: 'Paso14FuenteConflictoComponent', subSteps: []
        },

        {
          label: 'Otros Bienes Financieros y Físicos', key: 'paso15', order: 15, completed: false, enabled: true, status: 'pending',
          component: 'Paso15OtrosBienesComponent', subSteps: []
        },

        {
          label: 'Antecedentes Adicionales', key: 'paso16', order: 16, completed: false, enabled: true, status: 'pending',
          component: 'Paso16AntecedentesComponent', subSteps: []
        }
      ]
    },

    /* =====  2)  Ejemplo Cónyuge Christian  ===== */
    {
      id: 'decl-2',
      declara: 'Ejemplo Cónyuge Christian',
      relacion: 'Cónyuge',
      completed: false,
      intereses: [

        {
          label: 'Bienes Inmuebles', key: 'paso6', order: 1, completed: false, enabled: true, status: 'pending',
          component: 'Paso6BienesInmueblesComponent', subSteps: [
            { label: 'Situado en Chile', key: 'paso6-1', order: 11, completed: false, enabled: true, status: 'pending' },
            { label: 'Situado en el Exterior', key: 'paso6-2', order: 12, completed: false, enabled: true, status: 'pending' }
          ]
        },

        {
          label: 'Derechos de Aprovechamiento de Aguas', key: 'paso7', order: 2, completed: false, enabled: true, status: 'pending',
          component: 'Paso7DerechosAguasComponent', subSteps: [
            { label: 'Derecho de Aguas', key: 'paso7-1', order: 21, completed: false, enabled: true, status: 'pending' },
            { label: 'Concesiones', key: 'paso7-2', order: 22, completed: false, enabled: true, status: 'pending' }
          ]
        },

        {
          label: 'Bienes Muebles Registrables', key: 'paso8', order: 3, completed: false, enabled: true, status: 'pending',
          component: 'Paso8BienesMueblesComponent', subSteps: [
            { label: 'Vehículos Motorizados', key: 'paso8-1', order: 31, completed: false, enabled: true, status: 'pending' },
            { label: 'Aeronaves', key: 'paso8-2', order: 32, completed: false, enabled: true, status: 'pending' },
            { label: 'Naves o Artefactos Navales', key: 'paso8-3', order: 33, completed: false, enabled: true, status: 'pending' },
            { label: 'Otros Bienes Registrables', key: 'paso8-4', order: 34, completed: false, enabled: true, status: 'pending' }
          ]
        },

        {
          label: 'Derechos o Acciones en Entidades', key: 'paso9', order: 4, completed: false, enabled: true, status: 'pending',
          component: 'Paso9DerechosAccionesComponent', subSteps: [
            { label: 'Constituidas en Chile', key: 'paso9-1', order: 41, completed: false, enabled: true, status: 'pending' },
            { label: 'Constituidas en Exterior', key: 'paso9-2', order: 42, completed: false, enabled: true, status: 'pending' }
          ]
        },

        {
          label: 'Valores (Instrumentos Financieros)', key: 'paso10', order: 5, completed: false, enabled: true, status: 'pending',
          component: 'Paso10ValoresComponent', subSteps: [
            { label: 'Transables en Chile', key: 'paso10-1', order: 51, completed: false, enabled: true, status: 'pending' },
            { label: 'Transables en Exterior', key: 'paso10-2', order: 52, completed: false, enabled: true, status: 'pending' }
          ]
        },

        {
          label: 'Valores Obligatorios Adicionales', key: 'paso11', order: 6, completed: false, enabled: true, status: 'pending',
          component: 'Paso11ValoresObligatoriosComponent', subSteps: [
            { label: 'Cuentas / Libretas Ahorro', key: 'paso11-1', order: 61, completed: false, enabled: true, status: 'pending' },
            { label: 'Ahorro Previsional Vol.', key: 'paso11-2', order: 62, completed: false, enabled: true, status: 'pending' },
            { label: 'Depósitos a Plazo', key: 'paso11-3', order: 63, completed: false, enabled: true, status: 'pending' },
            { label: 'Seguros', key: 'paso11-4', order: 64, completed: false, enabled: true, status: 'pending' }
          ]
        },

        {
          label: 'Mandato Especial de Administración de Valores', key: 'paso12', order: 7, completed: false, enabled: true, status: 'pending',
          component: 'Paso12MandatoEspecialComponent', subSteps: []
        },

        {
          label: 'Pasivos', key: 'paso13', order: 8, completed: false, enabled: true, status: 'pending',
          component: 'Paso13PasivosComponent', subSteps: [
            { label: 'Deuda por pensión de alimentos', key: 'paso13-1', order: 81, completed: false, enabled: true, status: 'pending' },
            { label: 'Pasivos', key: 'paso13-2', order: 82, completed: false, enabled: true, status: 'pending' },
            { label: 'Deuda > 100 UTM', key: 'paso13-3', order: 83, completed: false, enabled: true, status: 'pending' }
          ]
        }
      ]
    }
  ],

  /*  Declaración que se muestra inicialmente en el segundo stepper  */
  activeDeclaracionId: 'decl-1'
};


/* ╔═ Tablas de mapeo ─────────────────────────────────────────── */
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
  paso13: {
    'Deudas por pensión de alimentos': 'paso13-1',
    'Pasivos': 'paso13-2'
  }
};


/* Flags que vienen de obtenerRegistro → paso principal o subpaso a habilitar */
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

  const state: FormState = structuredClone(initialState);

  /* Agrupar ítems por persona -------------------------------- */
  const grupos = new Map<number, any[]>();
  api.items.forEach((it: any) => {
    (grupos.get(it.idDeclarante) ?? grupos.set(it.idDeclarante, []).get(it.idDeclarante)!)
      .push(it);
  });

  /* Crear declaraciones dinámicamente ------------------------ */
  state.declaraciones = Array.from(grupos.entries()).map(([idDecl, lista], idx) => {

    /* 2.1 Cuáles pasos/sub‑pasos llegaron realmente */
    const pasoRecibido = new Set<string>();
    lista.forEach(it => {
      const p = MAIN_STEP[it.idMenu];
      const s = SUB_STEP[p]?.[it.item.trim()];
      pasoRecibido.add(p);
      if (s) { pasoRecibido.add(s); }
    });

    /* 2.2 Partir de plantilla y **quitar** lo que no llegó (salvo declarante) */
    const plantilla = structuredClone(initialState.declaraciones[0]).intereses;
    const intereses = plantilla
      .filter((st: any) => lista[0].esDeclarante || pasoRecibido.has(st.key))
      .map((st: any) => {
        st.subSteps = st.subSteps.filter((ss: any) =>
          lista[0].esDeclarante || pasoRecibido.has(ss.key)
        );
        return st;
      });

    /* 2.3 Completar datos, enabled/completed, flags, burbujeo */
    const first = lista[0];

    intereses.forEach((st: any) => {
      const itemsStep = lista.filter(it => {
        const p = MAIN_STEP[it.idMenu];
        const s = SUB_STEP[p]?.[it.item.trim()];
        return st.key === (s ?? p) || st.key === p;
      });

      if (st.subSteps.length) {
        // ─── ACTUALIZAR CADA SUB‑STEP ──────────────────────────────
        st.subSteps.forEach((c: any) => {
          const i = itemsStep.find(it => {
            const s = SUB_STEP[MAIN_STEP[it.idMenu]]?.[it.item.trim()];
            return s === c.key;
          });

          if (i) {
            c.enabled = i.tiene !== 'No Tiene';
            c.completed = !i.incompleto;
            c.status = c.completed ? 'completed'
              : i.incompleto ? 'incomplete' : 'pending';
          } else {
            // sub‑paso no llegó en los datos → deshabilitado
            c.enabled = false;
          }
        });

        /* padre habilitado si AL MENOS un hijo habilitado            */
        st.enabled = st.subSteps.some((c: any) => c.enabled);
      } else {
        const src = itemsStep[0];
        if (src) {
          st.enabled = src.tiene !== 'No Tiene';
          st.completed = !src.incompleto;
          st.status = st.completed ? 'completed'
            : src.incompleto ? 'incomplete' : 'pending';
        }
      }
    });

    applyFlags(intereses, flags);
    bubbleCompletion(intereses);

    return <Declaracion>{
      id: `decl-${idx + 1}`,
      declara: first.nombreDeclarante.trim(),
      relacion: first.tipo.startsWith('Declarante') ? '' :
        first.tipo.startsWith('Cónyuge') ? 'Cónyuge' :
          'Persona Relacionada',
      idDeclarante: idDecl,
      esDeclarante: !!first.esDeclarante,   // <<── NUEVO
      completed: intereses.every((p: any) => p.completed),
      intereses
    };
  });

  state.activeDeclaracionId = state.declaraciones[0]?.id ?? '';
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


  private activeDeclaracionSubject = new BehaviorSubject<any>(null);
  public activeDeclaracion$ = this.activeDeclaracionSubject.asObservable();

  private activeDeclaranteSubject = new BehaviorSubject<any>(null);
  public activeDeclarante$ = this.activeDeclaranteSubject.asObservable();

  private stepsSubject = new BehaviorSubject<StepData[]>([]);
  steps$ = this.stepsSubject.asObservable();


  private declaracionesFlagSubject = new BehaviorSubject<any>(null);
  declaracionesFlag$ = this.declaracionesFlagSubject.asObservable();

  


  setDeclaracionId(value: number) {
    this.activeDeclaracionSubject.next(value);
  }

  get declaracionId(): any {
    return this.activeDeclaracionSubject.value;
  }

  setDeclaranteId(value: number) {
    this.activeDeclaranteSubject.next(value);
  }

  get declaranteId(): any {
    return this.activeDeclaranteSubject.value;
  }

  setDeclaracionesFlagSubject(value: any) {
    this.declaracionesFlagSubject.next(value);
  }

  get declaracionesFlag(): any {
    return this.declaracionesFlagSubject.value;
  }

  constructor(
    private _declaracion: DeclaracionService,
    private _declarante: DeclaranteService,
    private _datosLaborales: DatosLaboralesService,
    private _personaRelacionada: PersonaRelacionadaService,
  ) {


    forkJoin([
      this._declaracion.confirmarDatos(1319527),
      this._declaracion.obtenerRegistro(2882000)
    ]).subscribe({
      next: ([confirm, registro]: any) => {
        console.log(confirm)
        console.log(registro)

        this.declaracionesFlagSubject.next(registro);


        const nuevoState = buildFormState(confirm, registro);
        console.log(nuevoState)

        this.validarPasosDeclarante(2882000, 1319527);
        this._state$.next(nuevoState);
      },
      error: err => console.error(err)
    });
  }



  validarPasosDeclarante(declaranteId: number, declaracionId: number) {
    this._declaracion.obtenerRegistro(declaranteId).subscribe({
      next: (res) => {
        console.log(res)
        if (res) {
          this.markStepCompleted(['declarante', 'paso1'])
        }
      }
    })

    this._declarante.getDatosDeclarante(declaracionId).subscribe({
      next: (res) => {
        console.log(res)

        if (res) {
          this.markStepCompleted(['declarante', 'paso2'])
        }
      }
    })

    this._datosLaborales.getDatosLaborales(declaracionId).subscribe({
      next: (res) => {
        console.log(res)

        if (res) {
          this.markStepCompleted(['declarante', 'paso3'])
        }
      }
    })

    this._declaracion.obtenerAplica(declaracionId).subscribe({
      next: (res) => {
        console.log(res)

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
    this._declaracion.confirmarDatos(1319527).subscribe({
      next: (res: any) => {
        console.log(res)
      },
      error: (err) => {
        console.log(err);
      }

    })
  }
  getDeclaracionesFlag(declaranteId: number) {
    this._declaracion.obtenerRegistro(declaranteId).subscribe({
      next: (res) => {
        this.setDeclaracionesFlagSubject(res)
        this.getConfirmacionDatos()
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  private readonly currentStepKeySubject = new BehaviorSubject<string>('paso1');
  readonly currentStepKey$ = this.currentStepKeySubject.asObservable();

  /** El stepper (o cualquier componente) debe llamar a esto
   *  cada vez que cambia manualmente de pestaña               */
  setCurrentStep(key: string): void {
    if (this.currentStepKeySubject.value !== key) {      // ← NUEVO
      this.currentStepKeySubject.next(key);
    }
  }
  /* ───── Fuente de verdad ───── */
  private readonly _state$ = new BehaviorSubject<FormState>(structured(initialState));
  readonly state$ = this._state$.asObservable();
  

  /* ───── Eventos (“siguiente paso”) ───── */
  private readonly nextStepSubject = new Subject<void>();
  readonly nextStep$ = this.nextStepSubject.asObservable();


  activeDeclaranteName$ = this.state$.pipe(
    map(st => st.declaraciones
                   .find(d => d.id === st.activeDeclaracionId)
                   ?.declara ?? '')
  );

  nextStep(): void {

    const st        = this._state$.value;
    const activeKey = this.currentStepKeySubject.value;
  
    const rootDecl = st.declarante .filter(p => p.enabled).sort((a,b)=>a.order-b.order);
    const rootInt  = (
        st.declaraciones.find(d => d.id === st.activeDeclaracionId)
          ?.intereses ?? []
      ).filter(p => p.enabled).sort((a,b)=>a.order-b.order);
  
    const sequence = [...rootDecl, ...rootInt];
  
    const idx  = sequence.findIndex(p => p.key === activeKey);
    const next = idx >= 0 ? sequence[idx + 1] : undefined;
    if (!next) { return; }
  
    const inDecl = rootDecl.some(p => p.key === next.key);
    this.blockSubject.next(inDecl ? 'decl' : 'int');
  
    this.currentStepKeySubject.next(next.key);
    this.nextStepSubject.next();
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

  /** Progreso global (0‑1) */
  globalProgress$ = this.state$.pipe(map(st => {
    const all = [
      ...flatten(st.declarante),
      ...st.declaraciones.flatMap(d => flatten(d.intereses))
    ];
    return all.length ? all.filter(x => x.completed).length / all.length : 0;
  }));
  /** Progreso declarante sólo */
  declProgress$ = this.state$.pipe(map(st => {
    const en = st.declarante.filter(p => p.enabled);
    return en.length ? en.filter(p => p.completed).length / en.length : 0;
  }));
  /** Progreso intereses (declaración activa) */
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

  /** Habilita / deshabilita un Paso (útil para lógica condicional) */
  toggleEnabled(path: string[], flag: boolean): void {
    const copy = structured(this._state$.value);
    const step = this.locateStep(copy, path);
    if (step) { step.enabled = flag; this._state$.next(copy); }
  }

  /** Cambia la declaración activa mostrada en el segundo stepper */
  setActiveDeclaracion(id: string): void {
    const copy = { ...this._state$.value, activeDeclaracionId: id };
    this._state$.next(copy);
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

  /** Busca por key en todo el árbol (más cómodo para componentes pequeños) */
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

  /** Devuelve TRUE si el paso (o subpaso) está completo */
  isComplete(key: string): boolean {
    const st = this._state$.value;
    return !!findStep(st.declarante, key)?.completed ||
      !!st.declaraciones.find(d => findStep(d.intereses, key)?.completed);
  }

  /** Porcentaje global 0‑100 (método sincrónico) */
  getCompletionPercentage(): number {
    const st = this._state$.value;
    const all = [
      ...flatten(st.declarante),
      ...st.declaraciones.flatMap(d => flatten(d.intereses))
    ];
    return all.length ? Math.round(all.filter(x => x.completed).length / all.length * 100) : 0;
  }
}


