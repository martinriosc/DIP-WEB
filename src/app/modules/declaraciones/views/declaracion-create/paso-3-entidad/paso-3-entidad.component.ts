import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-paso-3-entidad',
  templateUrl: './paso-3-entidad.component.html',
  styleUrls: ['./paso-3-entidad.component.scss']
})
export class Paso3EntidadComponent {
  entidadForm = new FormGroup({
    servicio: new FormControl(''),
    cargoFuncion: new FormControl(''),
    tipoSujeto: new FormControl(''),
    subnumeral: new FormControl(''),
    grado: new FormControl(''),
    rentaMensual: new FormControl(''),
    fechaAsuncion: new FormControl(''),
    regionDesempeno: new FormControl(''),
    comunaDesempeno: new FormControl(''),
    jefeServicio: new FormControl(false), // boolean
  });

  guardarEntidad() {
    console.log('Entidad:', this.entidadForm.value);
    // Lógica real de guardado...
  }
}
