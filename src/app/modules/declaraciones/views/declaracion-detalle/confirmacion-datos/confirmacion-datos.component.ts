import { Component, OnInit } from '@angular/core';
import { ValidadorDeclaracionService } from '../../../services/validador-declaracion.service';
import { initialState } from '../../../services/stepper-status.service';
import { Declaracion } from '../../../models/Step';
import { DeclaracionService } from '../../../services/declaracion.service';
import { DeclaracionHelperService } from '../../../services/declaracion-helper.service';

@Component({
  selector: 'app-confirmacion-datos',
  standalone: false,
  templateUrl: './confirmacion-datos.component.html',
  styleUrls: ['./confirmacion-datos.component.scss']
})
export class ConfirmacionDatosComponent implements OnInit {

  declaraciones: Declaracion[] = [];
  advertencias: string[] = [];
  aceptaResponsabilidad = false;

  declaracionId: number = 0;
  declaranteId: number = 0;

  constructor(private _validador: ValidadorDeclaracionService, private _declaracion: DeclaracionService, private _declaracionHelper: DeclaracionHelperService) {}

  ngOnInit(): void {

    this._declaracionHelper.state$.subscribe(state => {
      this.declaraciones = state.declaraciones;

      /* Advertencias: solo pasos habilitados pero NO completos */
      this.advertencias = this.declaraciones.flatMap(d =>
        d.intereses
          .filter(s => s.enabled && !s.completed)
          .map(s => `Falta completar «${s.label}» para ${d.declara}`)
      );
    })

  }

  loadConfirmacionDatos(): void {
    this._declaracion.confirmarDatos(this.declaracionId)
      .subscribe({ next: console.log, error: console.error });
  }

  verPaso(declId: string, key: string): void {
    // this._declaracionHelper.goToStep?.(declId, key);
  }

  finalizar(): void {
    if (this.advertencias.length) {
      alert('Aún hay pasos incompletos. Revísalos antes de finalizar.');
      return;
    }
    if (!this.aceptaResponsabilidad) {
      alert('Debes aceptar la declaración de veracidad.');
      return;
    }
    this._validador.enviarDeclaracionFinal();
    alert('¡Declaración finalizada con éxito!');
  }
}
