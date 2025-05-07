import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { map } from 'rxjs/operators';
import { FormState, Step } from '../models/Step';
export const initialState: FormState = {

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

@Injectable({ providedIn: 'root' })
export class StepperStatusService {
  private readonly _state$ = new BehaviorSubject<FormState>(initialState);
  readonly state$ = this._state$.asObservable();

  private readonly nextStepSubject = new Subject<void>();
  readonly nextStep$ = this.nextStepSubject.asObservable();
  nextStep(): void {

    this.nextStepSubject.next();
  }

  declaranteSteps$ = this.state$.pipe(map(s => s.declarante));
  interesesSteps$ = this.state$.pipe(
    map(s => s.declaraciones.find(d => d.id === s.activeDeclaracionId)?.intereses ?? [])
  );
  activeId$ = this.state$.pipe(map(s => s.activeDeclaracionId));
  declaraciones$ = this.state$.pipe(map(s => s.declaraciones));
  globalProgress$ = this.state$.pipe(map(this.calcGlobalProgress));

  declProgress$ = this.state$.pipe(map(s => {
    const arr = s.declarante.filter(p => p.enabled);
    return arr.length ? arr.filter(p => p.completed).length/arr.length : 0;
  }));
  intProgress$ = this.state$.pipe(map(s => {
    const d = s.declaraciones.find(x => x.id===s.activeDeclaracionId);
    if (!d) { return 0; }
    const arr = d.intereses.filter(p => p.enabled);
    return arr.length ? arr.filter(p => p.completed).length/arr.length : 0;
  }));


  

    private blockSubject = new BehaviorSubject<'decl'|'int'>('decl');
    block$ = this.blockSubject.asObservable();
  
    setActiveBlock(block: 'decl'|'int') {
      this.blockSubject.next(block);
    }

    
  /* ─────────── MUTACIONES ─────────── */
  markStepCompleted(path: string[]): void {

    const copy = structuredClone(this._state$.value) as FormState;
    const step = this.locateStep(copy, path);
    if (!step) { return; }
    step.completed = true;
    step.status = 'completed';

    /* burbujeo: si todos los hijos completos => padre completo */
    this.bubbleCompletion(copy.declarante);
    copy.declaraciones.forEach(d => {
      this.bubbleCompletion(d.intereses);
      d.completed = d.intereses.every(s => s.completed);
    });

    this._state$.next(copy);
  }

  markStepIncomplete(path: string[]): void {
    const copy = structuredClone(this._state$.value) as FormState;
    const step = this.locateStep(copy, path);
    if (!step) { return; }
    step.status = 'incomplete';
    this._state$.next(copy);
  }

  setActiveDeclaracion(id: string) {
    const copy = { ...this._state$.value, activeDeclaracionId: id };
    this._state$.next(copy);
  }

  /* ─────────── HELPERS ─────────── */
  private locateStep(node: any, path: string[]): Step | undefined {
    if (!path.length) { return undefined; }
    const [head, ...rest] = path;
    if (head === 'declarante') {
      return this.findStepInArray(node.declarante, rest);
    }
    if (head === 'declaraciones') {
      const [id, ...tail] = rest;
      const dec = node.declaraciones.find((d: any) => d.id === id);
      return dec ? this.findStepInArray(dec.intereses, tail) : undefined;
    }
    return undefined;
  }

  private findStepInArray(arr: Step[], rest: string[]): Step | undefined {
    if (!rest.length) { return undefined; }
    const [key, ...tail] = rest;
    const found = arr.find(s => s.key === key);
    return tail.length ? this.findStepInArray(found?.subSteps ?? [], tail) : found;
  }

  private bubbleCompletion(steps: Step[]) {
    steps.forEach(s => {
      if (s.subSteps?.length) {
        this.bubbleCompletion(s.subSteps);
        s.completed = s.subSteps.every(c => c.completed);
      }
    });
  }

  private calcGlobalProgress(state: FormState): number {
    const flatten = (arr: Step[]): Step[] =>
      arr.flatMap(s => [s, ...(s.subSteps ? flatten(s.subSteps) : [])]);
    const all = [
      ...flatten(state.declarante),
      ...state.declaraciones.flatMap(d => flatten(d.intereses))
    ];
    const done = all.filter(s => s.completed).length;
    return done / all.length || 0;
  }

}
