import { Component, OnInit } from '@angular/core';
import { ValidadorDeclaracionService } from '../../../services/validador-declaracion.service';
import { initialState } from '../../../services/stepper-status.service';
import { Declaracion } from '../../../models/Step';
import { DeclaracionService } from '../../../services/declaracion.service';

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

  constructor(private _validador: ValidadorDeclaracionService, private _declaracion: DeclaracionService) {}

  ngOnInit(): void {
    this._validador.getDeclaraciones().then(decls => {
      this.declaraciones = decls;
  
      /* Advertencias */
      this.advertencias = this.declaraciones
        .flatMap(d =>
          d.intereses
            .filter(s => !s.completed)
            .map(s => `Falta completar «${s.label}» para ${d.declara}`)
        );
    });
  }

  loadConfirmacionDatos(){
    this._declaracion.confirmarDatos(this.declaracionId).subscribe({
      next: (res: any) => {
        console.log(res)
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  verPaso(declId: string, key: string): void {
    // this._validador.goToStep(declId, key);
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
