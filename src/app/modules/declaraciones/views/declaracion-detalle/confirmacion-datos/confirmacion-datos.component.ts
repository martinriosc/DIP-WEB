import { Component, OnInit } from '@angular/core';
import { Declaracion } from '../../../models/Step';
import { DeclaracionService } from '../../../services/declaracion.service';
import { DeclaracionHelperService } from '../../../services/declaracion-helper.service';

interface DatosDeclarante {
  id: number;
  tipoDeclaracion: string;
  bLugarDeclaracion: boolean;
  lugarDeclaracion: string;
  region: string;
  comuna: string;
  rut: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  profesion: string;
  direccion: string;
  estadoCivil: string;
  regimenPatrimonial: string;
  servicio: string;
  autonomo: boolean;
  textoAutonomo: boolean;
  cargo: string;
  remuneracionTipo: string;
  grado: string;
  fechaAsuncion: string;
  bLugarDesempeno: boolean;
  lugarDesempeno: string;
  regionDesempeno: string;
  comunaDesempeno: string;
  items: any[];
  valida: boolean;
  datosDeclarante: boolean;
  datosEntidad: boolean;
  personasRelacionadas: boolean;
  sujetoObligado: string;
}

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
  datosDeclarante: DatosDeclarante | null = null;

  declaracionId: number = this._declaracionHelper.declaracionId;
  declaranteId: number = this._declaracionHelper.declaranteId;

  constructor(private _declaracion: DeclaracionService, private _declaracionHelper: DeclaracionHelperService) {}

  ngOnInit(): void {
    this.loadConfirmacionDatos();

    this._declaracionHelper.state$.subscribe(state => {
      this.declaraciones = state.declaraciones;
    });
  }

  loadConfirmacionDatos(): void {
    this._declaracion.confirmarDatos(this.declaracionId)
      .subscribe({ 
        next: (response) => {
          this.datosDeclarante = response;
          console.log('Datos del declarante cargados:', response);
          if (this.datosDeclarante && this.datosDeclarante.items) {
            this.advertencias = this.datosDeclarante.items
              .filter(item => item.incompleto)
              .map(item => `Falta completar «${item.item}» para ${item.nombreDeclarante}`);
          } else {
            this.advertencias = [];
          }
        }, 
        error: console.error 
      });
  }

  getFilteredItemsByDeclaranteName(declaranteName: string): any[] {
    if (!this.datosDeclarante || !this.datosDeclarante.items) {
      return [];
    }
    const cleanDeclaranteName = declaranteName.replace('Declarante:  ', '');
    return this.datosDeclarante.items.filter(item => item.nombreDeclarante === cleanDeclaranteName);
  }

  areAllItemsCompleteForDeclarante(declaranteName: string): boolean {
    const items = this.getFilteredItemsByDeclaranteName(declaranteName);
    if (!items.length) return true;
    return items.every(item => !item.incompleto);
  }

  get tienePersonasRelacionadas(): string {
    return this.datosDeclarante?.personasRelacionadas ? 'Tiene' : 'No tiene';
  }
  get lugarDeclaracionCompleto(): string {
    if (!this.datosDeclarante) return '';
    const { lugarDeclaracion, region, comuna } = this.datosDeclarante;
    return `${lugarDeclaracion ?? ''} / ${region ?? ''} / ${comuna ?? ''}`;
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
    // this._validador.enviarDeclaracionFinal();
    alert('¡Declaración finalizada con éxito!');
  }
}
