import { Type } from "@angular/core";

/* step-model.ts */
export interface Step {
  label: string;
  key: string;                 // «paso1», «paso6‑1», …
  order: number;               // índice absoluto ↔ orden visual
  completed: boolean;
  enabled: boolean;
  component?: string;
  subSteps?: Step[];

  status: 'pending'    // no visitado o espera
  | 'incomplete' // visitado pero inválido
  | 'completed';
}

export interface Declaracion {
  id: string;                  // uuid o slug legible
  declara: string;             // «Christian Contardo»
  relacion?: string;           // «Cónyuge», «Hijo», etc.
  completed: boolean;          // todas sus secciones finalizadas
  intereses: Step[];           // pasos 5 ⇢ 16
}

export interface FormState {
  declarante: Step[];          // pasos 1 ⇢ 4
  declaraciones: Declaracion[];
  activeDeclaracionId: string; // declara que está mostrando el 2.º stepper
}
