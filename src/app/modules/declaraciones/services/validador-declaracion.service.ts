// archivo: validador-declaracion.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidadorDeclaracionService {
  /**
   * Mapa con el estado de cada paso o sección.
   * Por ejemplo: 'paso2', 'paso3', ... 'paso16'.
   * true = completo; false = incompleto.
   */
  private pasosCompletos: Record<string, boolean> = {
    paso1: false,
    paso2: false,
    paso3: false,
    paso4: false,
    paso5: false,
    paso6: false,
    paso7: false,
    paso8: false,
    paso9: false,
    paso10: false,
    paso11: false,
    paso12: false,
    paso13: false,
    paso14: false,
    paso15: false,
    paso16: false
  };

  /**
   * Lista de advertencias generadas al validar la declaración.
   */
  private mensajesIncompletos: string[] = [];

  constructor() {
    // Por defecto, podrías cargar de un backend o storage
    // para saber qué pasos ya estaban marcados como completos
  }

  /**
   * Marca un paso como completo o incompleto.
   * @param paso Ej: 'paso2', 'paso3'...
   * @param completo Valor booleano
   */
  public setPasoCompleto(paso: string, completo: boolean): void {
    if (this.pasosCompletos.hasOwnProperty(paso)) {
      this.pasosCompletos[paso] = completo;
    } else {
      console.warn(`El paso '${paso}' no existe.`);
    }
  }

  public isPasoCompleto(paso: string): boolean {
    return !!this.pasosCompletos[paso];
  }

  /**
   * Retorna si todos los pasos requeridos están completos.
   * Además, llena la lista de mensajes con los pasos faltantes.
   * @returns true si no hay pasos incompletos
   */
  public estanTodosCompletos(): boolean {
    // Limpia la lista de advertencias
    this.mensajesIncompletos = [];

    // Revisa cada paso
    Object.entries(this.pasosCompletos).forEach(([nombrePaso, completo]) => {
      if (!completo) {
        this.mensajesIncompletos.push(`El ${nombrePaso} no está completo o le falta información.`);
      }
    });

    // Si no hay mensajes, es que todos están completos
    return this.mensajesIncompletos.length === 0;
  }

  /**
   * Retorna la lista de advertencias (pasos incompletos u otros).
   */
  public getAdvertencias(): string[] {
    return this.mensajesIncompletos;
  }

  /**
   * Lógica de ejemplo que simula el envío final de la declaración.
   * En un caso real, aquí harías una petición HTTP al backend.
   */
  public enviarDeclaracionFinal(): void {
    // Ejemplo: Imprimir en consola
    console.log('Enviando declaración al servidor...');

    // Lógica real: un HttpClient.post(...) con los datos recopilados de la declaración
  }
}
