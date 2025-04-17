import { Component, Optional, SkipSelf } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidadorDeclaracionService } from '../../../../services/validador-declaracion.service';
import { MatStepper } from '@angular/material/stepper';

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
    apellidoMaterno: new FormControl('', [Validators.required]),
    profesion: new FormControl('', [Validators.required]),
    lugarReside: new FormControl('chile', [Validators.required]), // chile / extranjero
    region: new FormControl('', [Validators.required]),
    comuna: new FormControl('', [Validators.required]),
    domicilioParticular: new FormControl('', [Validators.required]),
    estadoCivil: new FormControl('', [Validators.required]),
    regimenPatrimonial: new FormControl('', [Validators.required]),
    rutConyuge: new FormControl('', [Validators.required]),
    nombresConyuge: new FormControl('', [Validators.required]),
    apellidoPaternoConyuge: new FormControl('', [Validators.required]),
    apellidoMaternoConyuge: new FormControl('', [Validators.required])
  });

  constructor(
    private validadorDeclaracionService: ValidadorDeclaracionService,
    @Optional() @SkipSelf() private stepper?: MatStepper
  ) { }

  /** Guardar + avanzar */
  onSubmit(): void {
    const ok = this.datosPersonalesForm.valid;
    const key = 'paso2';

    ok ? this.validadorDeclaracionService.markComplete(key)
      : this.validadorDeclaracionService.markIncomplete(key);

    if (ok && this.stepper) {
      this.stepper.next();
    }
  }
}
