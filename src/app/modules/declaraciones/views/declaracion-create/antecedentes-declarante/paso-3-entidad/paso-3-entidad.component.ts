import { Component, Optional, SkipSelf } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidadorDeclaracionService } from '../../../../services/validador-declaracion.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-paso-3-entidad',
  templateUrl: './paso-3-entidad.component.html',
  styleUrls: ['./paso-3-entidad.component.scss']
})
export class Paso3EntidadComponent {
  entidadForm = new FormGroup({
    servicio: new FormControl('', [Validators.required]),
    cargoFuncion: new FormControl('', [Validators.required]),
    tipoSujeto: new FormControl('', [Validators.required]),
    subnumeral: new FormControl('', [Validators.required]),
    grado: new FormControl('', [Validators.required]),
    rentaMensual: new FormControl('', [Validators.required]),
    fechaAsuncion: new FormControl('', [Validators.required]),
    regionDesempeno: new FormControl('', [Validators.required]),
    comunaDesempeno: new FormControl('', [Validators.required]),
    jefeServicio: new FormControl(false)
  });

  constructor(private validadorDeclaracionService: ValidadorDeclaracionService, @Optional() @SkipSelf() private stepper?: MatStepper) {}

  /** Guardar + avanzar */
  onSubmit(): void {
    const ok = this.entidadForm.valid;
    const key = 'paso3';

    ok ? this.validadorDeclaracionService.markComplete(key)
      : this.validadorDeclaracionService.markIncomplete(key);

    if (ok && this.stepper) {
      this.stepper.next();
    }
  }
}
