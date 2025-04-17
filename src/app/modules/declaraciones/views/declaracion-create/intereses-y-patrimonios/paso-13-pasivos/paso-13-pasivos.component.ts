import { Component, ViewChild, TemplateRef, Optional, SkipSelf } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ValidadorDeclaracionService } from '../../../../services/validador-declaracion.service';
import { MatStepper } from '@angular/material/stepper';

interface PasivoItem {
  tipoPasivo: string;
  institucion: string;
  monto: number;
  fechaAdquisicion: string;
}

@Component({
  selector: 'app-paso-13-pasivos',
  templateUrl: './paso-13-pasivos.component.html',
  styleUrls: ['./paso-13-pasivos.component.scss']
})
export class Paso13PasivosComponent {
  tienePasivos = 'no';

  pasivosData: PasivoItem[] = [
    { tipoPasivo: 'CREDITO', institucion: 'Banco ABC', monto: 2000000, fechaAdquisicion: '15/03/2023' }
  ];

  @ViewChild('pasivoModal') pasivoModal!: TemplateRef<any>;
  pasivoForm!: FormGroup;
  editMode = false;
  currentItem: PasivoItem | null = null;
  dialogRef: MatDialogRef<any> | null = null;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private validadorDeclaracionService: ValidadorDeclaracionService,
    @Optional() @SkipSelf() private stepper?: MatStepper
  ) {
    // Marca "paso13" como completo si ya hay datos
  }

  onSubmit(): void {
    const ok = (this.pasivosData.length > 0 && this.tienePasivos) || !this.tienePasivos;
    const key = 'paso13';

    ok ? this.validadorDeclaracionService.markComplete(key)
      : this.validadorDeclaracionService.markIncomplete(key);

    if (ok && this.stepper) {
      this.stepper.next();
    }
  }

  // Cambio del radio "¿Tiene Pasivos?"
  onTienePasivosChange(value: string) {
    this.tienePasivos = value;
    if (value === 'no') {
      // this.pasivosData = [];
      this.validadorDeclaracionService.setPasoCompleto('paso13', false);
    } else {
      this.validadorDeclaracionService.setPasoCompleto('paso13', this.pasivosData.length > 0);
    }
  }

  openAddModal() {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.dialogRef = this.dialog.open(this.pasivoModal);
  }

  openEditModal(item: PasivoItem) {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.dialogRef = this.dialog.open(this.pasivoModal);
  }

  buildForm(item?: PasivoItem) {
    this.pasivoForm = this.fb.group({
      tipoPasivo: [item?.tipoPasivo || 'CREDITO', Validators.required],
      institucion: [item?.institucion || '', Validators.required],
      monto: [item?.monto || 0, [Validators.required, Validators.min(1)]],
      fechaAdquisicion: [item?.fechaAdquisicion || '', Validators.required]
    });
  }

  savePasivo(dialogRef: any) {
    if (this.pasivoForm.invalid) {
      this.validadorDeclaracionService.setPasoCompleto('paso13', false);
      return;
    }

    const formValue = this.pasivoForm.value as PasivoItem;
    if (this.editMode && this.currentItem) {
      const i = this.pasivosData.indexOf(this.currentItem);
      if (i >= 0) {
        this.pasivosData[i] = formValue;
      }
    } else {
      this.pasivosData.push(formValue);
    }
    dialogRef.close();

    // Marcar como completo si hay al menos un pasivo
    this.validadorDeclaracionService.setPasoCompleto('paso13', this.pasivosData.length > 0);
  }

  eliminarPasivo(p: PasivoItem) {
    this.pasivosData = this.pasivosData.filter(x => x !== p);
    // Si vacía la tabla => incompleto
    this.validadorDeclaracionService.setPasoCompleto('paso13', this.pasivosData.length > 0);
  }
}
