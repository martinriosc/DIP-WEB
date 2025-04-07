import { Component, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ValidadorDeclaracionService } from '../../../services/validador-declaracion.service';

interface OtroBien {
  descripcion: string;
  valorAprox: number;
  observaciones: string;
}

@Component({
  selector: 'app-paso-15-otros-bienes',
  templateUrl: './paso-15-otros-bienes.component.html',
  styleUrls: ['./paso-15-otros-bienes.component.scss']
})
export class Paso15OtrosBienesComponent {
  tieneOtrosBienes = 'no';

  otrosBienesData: OtroBien[] = [
    { descripcion: 'Colección de Arte', valorAprox: 2000000, observaciones: 'Cuadros de autor chileno' }
  ];

  @ViewChild('otrosBienesModal') otrosBienesModal!: TemplateRef<any>;
  otroBienForm!: FormGroup;
  editMode = false;
  currentItem: OtroBien | null = null;
  dialogRef: MatDialogRef<any> | null = null;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private validadorDeclaracionService: ValidadorDeclaracionService
  ) {
    // Marca el paso como completo si ya hay datos
    this.validadorDeclaracionService.setPasoCompleto('paso15', this.otrosBienesData.length > 0);
  }

  onTieneOtrosBienesChange(value: string) {
    this.tieneOtrosBienes = value;
    if (value === 'no') {
      // this.otrosBienesData = [];
      this.validadorDeclaracionService.setPasoCompleto('paso15', false);
    } else {
      this.validadorDeclaracionService.setPasoCompleto('paso15', this.otrosBienesData.length > 0);
    }
  }

  openAddModal() {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.dialogRef = this.dialog.open(this.otrosBienesModal);
  }

  openEditModal(item: OtroBien) {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.dialogRef = this.dialog.open(this.otrosBienesModal);
  }

  buildForm(item?: OtroBien) {
    this.otroBienForm = this.fb.group({
      descripcion: [item?.descripcion || '', Validators.required],
      valorAprox: [item?.valorAprox || 0, [Validators.required, Validators.min(0)]],
      observaciones: [item?.observaciones || '']
    });
  }

  saveOtroBien(dialogRef: any) {
    if (this.otroBienForm.invalid) {
      this.validadorDeclaracionService.setPasoCompleto('paso15', false);
      return;
    }

    const formValue = this.otroBienForm.value as OtroBien;
    if (this.editMode && this.currentItem) {
      const i = this.otrosBienesData.indexOf(this.currentItem);
      if (i >= 0) {
        this.otrosBienesData[i] = formValue;
      }
    } else {
      this.otrosBienesData.push(formValue);
    }
    dialogRef.close();

    this.validadorDeclaracionService.setPasoCompleto('paso15', this.otrosBienesData.length > 0);
  }

  eliminarOtroBien(o: OtroBien) {
    this.otrosBienesData = this.otrosBienesData.filter(x => x !== o);
    this.validadorDeclaracionService.setPasoCompleto('paso15', this.otrosBienesData.length > 0);
  }
}
