import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidadorDeclaracionService } from '../../../services/validador-declaracion.service';

@Component({
  selector: 'app-paso-2-datos-personales',
  templateUrl: './paso-2-datos-personales.component.html',
  styleUrls: ['./paso-2-datos-personales.component.scss']
})
export class Paso2DatosPersonalesComponent {
  datosPersonalesForm = new FormGroup({
    rut: new FormControl('', [Validators.required]),
    nombres: new FormControl('', [Validators.required]),
    apellidoPaterno: new FormControl('', [Validators.required]),
    apellidoMaterno: new FormControl(''),
    profesion: new FormControl(''),
    lugarReside: new FormControl('chile'), // chile / extranjero
    region: new FormControl(''),
    comuna: new FormControl(''),
    domicilioParticular: new FormControl(''),
    estadoCivil: new FormControl(''),
    regimenPatrimonial: new FormControl(''),
    rutConyuge: new FormControl(''),
    nombresConyuge: new FormControl(''),
    apellidoPaternoConyuge: new FormControl(''),
    apellidoMaternoConyuge: new FormControl('')
  });

  constructor(private validadorDeclaracionService: ValidadorDeclaracionService) {}

  guardarDatosPersonales() {
    // Validamos el formulario
    if (this.datosPersonalesForm.invalid) {
      // Marcamos el paso como incompleto
      this.validadorDeclaracionService.setPasoCompleto('paso2', false);
      // Aquí podrías mostrar mensajes o resaltar errores
      return;
    }

    // Marcamos el paso como completo
    this.validadorDeclaracionService.setPasoCompleto('paso2', true);

    console.log('Datos Personales:', this.datosPersonalesForm.value);
    // Aquí tu lógica real de guardado...
  }
}
