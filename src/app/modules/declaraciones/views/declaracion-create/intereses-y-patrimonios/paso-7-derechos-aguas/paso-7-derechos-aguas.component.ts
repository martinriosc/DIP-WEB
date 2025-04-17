import { Component, ViewChild, TemplateRef, Optional, SkipSelf } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ValidadorDeclaracionService } from '../../../../services/validador-declaracion.service';
import { MatStepper } from '@angular/material/stepper';

interface DerechoAgua {
  tipo: string;    // APROVECHAMIENTO, etc.
  rol: string;     // Rol o Identificador
  caudal: number;  // l/s
}

@Component({
  selector: 'app-paso-7-derechos-aguas',
  templateUrl: './paso-7-derechos-aguas.component.html',
  styleUrls: ['./paso-7-derechos-aguas.component.scss']
})
export class Paso7DerechosAguasComponent {
  tieneDerechosAguas = 'no';

  derechosAguasData: DerechoAgua[] = [
    { tipo: 'APROVECHAMIENTO', rol: '12345', caudal: 10 },
    { tipo: 'CONSUNTIVO', rol: '56789', caudal: 5 }
  ];

  @ViewChild('derechosAguasModal') derechosAguasModal!: TemplateRef<any>;
  derechosAguasForm!: FormGroup;
  editMode = false;
  currentItem: DerechoAgua | null = null;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private validadorDeclaracionService: ValidadorDeclaracionService,
    @Optional() @SkipSelf() private stepper?: MatStepper
  ) {}


  onSubmit(): void {
    const ok = (this.derechosAguasData.length > 0 && this.tieneDerechosAguas) || !this.tieneDerechosAguas
    const key = 'paso7';

    ok ? this.validadorDeclaracionService.markComplete(key)
      : this.validadorDeclaracionService.markIncomplete(key);

    if (ok && this.stepper) {
      this.stepper.next();
    }
  }


  openAddModal() {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.dialog.open(this.derechosAguasModal);
  }

  openEditModal(item: DerechoAgua) {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.dialog.open(this.derechosAguasModal);
  }

  buildForm(item?: DerechoAgua) {
    this.derechosAguasForm = this.fb.group({
      tipo: [item?.tipo || 'APROVECHAMIENTO'],
      rol: [item?.rol || ''],
      caudal: [item?.caudal || 0]
    });
  }

  saveDerecho(dialogRef: any) {
    if (this.derechosAguasForm.valid) {
      const formValue = this.derechosAguasForm.value as DerechoAgua;
      if (this.editMode && this.currentItem) {
        const i = this.derechosAguasData.indexOf(this.currentItem);
        if (i >= 0) {
          this.derechosAguasData[i] = formValue;
        }
      } else {
        this.derechosAguasData.push(formValue);
      }
      dialogRef.close();

      this.validadorDeclaracionService.setPasoCompleto('paso7', true);
    }
  }

  eliminarDerecho(item: DerechoAgua) {
    this.derechosAguasData = this.derechosAguasData.filter(x => x !== item);
  }

  onTieneDerechosChange(value: string) {
    this.tieneDerechosAguas = value;
    if (value === 'no') {
      // this.derechosAguasData = []; // si deseas vaciar
      this.validadorDeclaracionService.setPasoCompleto('paso7', false);
    }
  }
}
