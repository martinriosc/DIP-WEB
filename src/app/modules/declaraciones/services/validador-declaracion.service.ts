import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Interfaz para representar un “subpaso” o “paso”.
 * Observa que subSteps también es un array de Steps, permitiendo recursión.
 */
export interface StepData {
  label: string;
  key: string;
  completed: boolean;
  enabled: boolean;
  subSteps: StepData[];
  // Opcional: apunta a un componente Angular
  component?: any;
}

/**
 * Servicio que administra la lógica de completitud/habilitación
 * de un conjunto de pasos y subpasos, así como el cálculo de porcentaje.
 */
@Injectable({
  providedIn: 'root'
})
export class ValidadorDeclaracionService {
  /**
   * BehaviorSubject con el array de steps completo.
   * Cualquier componente suscrito (p.ej. el Stepper) puede reaccionar a cambios.
   */
  private stepsSubject = new BehaviorSubject<StepData[]>([]);
  steps$ = this.stepsSubject.asObservable();

  constructor() {}

  /**
   * Carga un nuevo arreglo de pasos (y subpasos) en el servicio.
   */
  setSteps(steps: StepData[]): void {
    this.stepsSubject.next(steps);
  }

  /**
   * Devuelve el snapshot actual del array de pasos.
   */
  getStepsSnapshot(): StepData[] {
    return this.stepsSubject.getValue();
  }

  /**
   * Busca recursivamente un paso (o subpaso) por key.
   */
  private findStepRecursive(key: string, steps: StepData[]): StepData | undefined {
    for (const step of steps) {
      if (step.key === key) {
        return step;
      }
      // Buscar en subSteps
      if (step.subSteps && step.subSteps.length > 0) {
        const found = this.findStepRecursive(key, step.subSteps);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }

  /**
   * Marca un paso (o subpaso) como completo.
   */
  markComplete(key: string): void {
    const steps = this.getStepsSnapshot();
    const found = this.findStepRecursive(key, steps);
    if (found) {
      found.completed = true;
      // Podrías forzar enabled = true si lo deseas
      this.stepsSubject.next(steps);
    }
  }

  /**
   * Marca un paso (o subpaso) como incompleto.
   */
  markIncomplete(key: string): void {
    const steps = this.getStepsSnapshot();
    const found = this.findStepRecursive(key, steps);
    if (found) {
      found.completed = false;
      this.stepsSubject.next(steps);
    }
  }

  /**
   * Habilita un paso (o subpaso).
   */
  enableStep(key: string): void {
    const steps = this.getStepsSnapshot();
    const found = this.findStepRecursive(key, steps);
    if (found) {
      found.enabled = true;
      this.stepsSubject.next(steps);
    }
  }

  /**
   * Deshabilita un paso (o subpaso).
   */
  disableStep(key: string): void {
    const steps = this.getStepsSnapshot();
    const found = this.findStepRecursive(key, steps);
    if (found) {
      found.enabled = false;
      this.stepsSubject.next(steps);
    }
  }

  /**
   * Retorna si un paso (o subpaso) está completo.
   */
  isComplete(key: string): boolean {
    const found = this.findStepRecursive(key, this.getStepsSnapshot());
    return !!found?.completed;
  }

  /**
   * Calcula el porcentaje de avance, contando **todos** los pasos y subpasos.
   * (pasosCompletos / pasosTotales) * 100
   */
  getCompletionPercentage(): number {
    const steps = this.getStepsSnapshot();
    const total = this.countAllSteps(steps);
    if (total === 0) {
      return 0;
    }
    const completeCount = this.countCompletedSteps(steps);
    return Math.round((completeCount / total) * 100);
  }

  /**
   * Devuelve cuántos pasos+subpasos hay en total.
   */
  private countAllSteps(steps: StepData[]): number {
    let count = 0;
    for (const step of steps) {
      count += 1;
      if (step.subSteps && step.subSteps.length > 0) {
        count += this.countAllSteps(step.subSteps);
      }
    }
    return count;
  }

  /**
   * Devuelve cuántos pasos+subpasos están completados.
   */
  private countCompletedSteps(steps: StepData[]): number {
    let count = 0;
    for (const step of steps) {
      if (step.completed) {
        count += 1;
      }
      if (step.subSteps && step.subSteps.length > 0) {
        count += this.countCompletedSteps(step.subSteps);
      }
    }
    return count;
  }

  /**
   * Lógica simulada de “enviar declaración final”.
   */
  enviarDeclaracionFinal(): void {
    const stepsData = this.getStepsSnapshot();
    console.log('Enviando declaración al backend (futuro). Pasos:', stepsData);
  }


  setPasoCompleto(paso: string, completado: boolean) {
    return;
  }
}
