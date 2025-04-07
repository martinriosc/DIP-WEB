import { Component, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ValidadorDeclaracionService } from '../../../services/validador-declaracion.service';

interface FuenteConflicto {
  descripcion: string;
  tipoConflicto: string;
}

@Component({
  selector: 'app-paso-14-fuente-conflicto',
  templateUrl: './paso-14-fuente-conflicto.component.html',
  styleUrls: ['./paso-14-fuente-conflicto.component.scss']
})
export class Paso14FuenteConflictoComponent {
  tieneFuenteConflicto = 'no';

  fuentesData: FuenteConflicto[] = [
    { descripcion: 'Tiene participación familiar en empresa X', tipoConflicto: 'FAMILIAR' }
  ];

  @ViewChild('conflictoModal') conflictoModal!: TemplateRef<any>;
  conflictoForm!: FormGroup;
  editMode = false;
  currentItem: FuenteConflicto | null = null;
  dialogRef: MatDialogRef<any> | null = null;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private validadorDeclaracionService: ValidadorDeclaracionService
  ) {
    // Marca el paso como completo si ya hay datos
    this.validadorDeclaracionService.setPasoCompleto('paso14', this.fuentesData.length > 0);
  }

  onTieneConflictoChange(value: string) {
    this.tieneFuenteConflicto = value;
    if (value === 'no') {
      // this.fuentesData = [];
      this.validadorDeclaracionService.setPasoCompleto('paso14', false);
    } else {
      this.validadorDeclaracionService.setPasoCompleto('paso14', this.fuentesData.length > 0);
    }
  }

  openAddModal() {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.dialogRef = this.dialog.open(this.conflictoModal);
  }

  openEditModal(item: FuenteConflicto) {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.dialogRef = this.dialog.open(this.conflictoModal);
  }

  buildForm(item?: FuenteConflicto) {
    this.conflictoForm = this.fb.group({
      descripcion: [item?.descripcion || '', Validators.required],
      tipoConflicto: [item?.tipoConflicto || 'FAMILIAR', Validators.required]
    });
  }

  saveFuente(dialogRef: any) {
    if (this.conflictoForm.invalid) {
      this.validadorDeclaracionService.setPasoCompleto('paso14', false);
      return;
    }

    const formValue = this.conflictoForm.value as FuenteConflicto;
    if (this.editMode && this.currentItem) {
      const i = this.fuentesData.indexOf(this.currentItem);
      if (i >= 0) {
        this.fuentesData[i] = formValue;
      }
    } else {
      this.fuentesData.push(formValue);
    }
    dialogRef.close();

    this.validadorDeclaracionService.setPasoCompleto('paso14', this.fuentesData.length > 0);
  }

  eliminarFuente(f: FuenteConflicto) {
    this.fuentesData = this.fuentesData.filter(x => x !== f);
    this.validadorDeclaracionService.setPasoCompleto('paso14', this.fuentesData.length > 0);
  }
}
