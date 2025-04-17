import { Component, ViewChild, TemplateRef, Optional, SkipSelf } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ValidadorDeclaracionService } from '../../../../services/validador-declaracion.service';
import { MatStepper } from '@angular/material/stepper';

interface Antecedente {
  tipo: string;             // PENAL, ADMINISTRATIVO, etc.
  detalle: string;          // Observaciones
  fechaResolucion: string;  // Ej: "12/03/2020"
}

@Component({
  selector: 'app-paso-16-antecedentes',
  templateUrl: './paso-16-antecedentes.component.html',
  styleUrls: ['./paso-16-antecedentes.component.scss']
})
export class Paso16AntecedentesComponent {
  tieneAntecedentes = 'no';
  antecedentesData: Antecedente[] = [
    { tipo: 'PENAL', detalle: 'Condena cumplida en 2010', fechaResolucion: '01/06/2010' }
  ];

  @ViewChild('antecedentesModal') antecedentesModal!: TemplateRef<any>;
  antecedentesForm!: FormGroup;
  editMode = false;
  currentItem: Antecedente | null = null;
  dialogRef: MatDialogRef<any> | null = null;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private validadorDeclaracionService: ValidadorDeclaracionService,
    @Optional() @SkipSelf() private stepper?: MatStepper
  ) {
    // Paso16 completo si ya hay al menos un antecedente
  }

  onSubmit(): void {
    const ok = (this.antecedentesData.length > 0 && this.tieneAntecedentes) || !this.tieneAntecedentes;
    const key = 'paso16';

    ok ? this.validadorDeclaracionService.markComplete(key)
      : this.validadorDeclaracionService.markIncomplete(key);

    if (ok && this.stepper) {
      this.stepper.next();
    }
  }

  onTieneAntecedentesChange(value: string) {
    this.tieneAntecedentes = value;
    if (value === 'no') {
      // this.antecedentesData = [];
      this.validadorDeclaracionService.setPasoCompleto('paso16', false);
    } else {
      this.validadorDeclaracionService.setPasoCompleto('paso16', this.antecedentesData.length > 0);
    }
  }

  openAddModal() {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.dialogRef = this.dialog.open(this.antecedentesModal);
  }

  openEditModal(item: Antecedente) {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.dialogRef = this.dialog.open(this.antecedentesModal);
  }

  buildForm(item?: Antecedente) {
    this.antecedentesForm = this.fb.group({
      tipo: [item?.tipo || 'PENAL', Validators.required],
      detalle: [item?.detalle || '', Validators.required],
      fechaResolucion: [item?.fechaResolucion || '', Validators.required]
    });
  }

  saveAntecedente(dialogRef: any) {
    if (this.antecedentesForm.invalid) {
      this.validadorDeclaracionService.setPasoCompleto('paso16', false);
      return;
    }

    const formValue = this.antecedentesForm.value as Antecedente;
    if (this.editMode && this.currentItem) {
      const i = this.antecedentesData.indexOf(this.currentItem);
      if (i >= 0) {
        this.antecedentesData[i] = formValue;
      }
    } else {
      this.antecedentesData.push(formValue);
    }
    dialogRef.close();

    this.validadorDeclaracionService.setPasoCompleto('paso16', this.antecedentesData.length > 0);
  }

  eliminarAntecedente(a: Antecedente) {
    this.antecedentesData = this.antecedentesData.filter(x => x !== a);
    this.validadorDeclaracionService.setPasoCompleto('paso16', this.antecedentesData.length > 0);
  }
}
