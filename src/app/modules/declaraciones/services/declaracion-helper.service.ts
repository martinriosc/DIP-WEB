import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Subject } from 'rxjs';
import { StepData } from './validador-declaracion.service';


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
  intereses: Step[];
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

  constructor() { }

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

  /* ───── Fuente de verdad ───── */
  private readonly _state$ = new BehaviorSubject<FormState>(structured(initialState));
  readonly state$          = this._state$.asObservable();

  /* ───── Eventos (“siguiente paso”) ───── */
  private readonly nextStepSubject = new Subject<void>();
  readonly nextStep$               = this.nextStepSubject.asObservable();
  nextStep(): void { this.nextStepSubject.next(); }

  /* ───── Bloque activo: decl | int ───── */
  private readonly blockSubject = new BehaviorSubject<'decl' | 'int'>('decl');
  readonly block$               = this.blockSubject.asObservable();
  setActiveBlock(b: 'decl' | 'int'): void { this.blockSubject.next(b); }

  /* ───── SELECTORES ───── */
  declaranteSteps$ = this.state$.pipe(map(s => s.declarante));
  interesesSteps$  = this.state$.pipe(
    map(s => s.declaraciones.find(d => d.id === s.activeDeclaracionId)?.intereses ?? [])
  );
  activeId$        = this.state$.pipe(map(s => s.activeDeclaracionId));
  declaraciones$   = this.state$.pipe(map(s => s.declaraciones));

  /** Progreso global (0‑1) */
  globalProgress$  = this.state$.pipe(map(st => {
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
  intProgress$  = this.state$.pipe(map(st => {
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
    return !!findStep(st.declarante, key) ?.completed ||
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


