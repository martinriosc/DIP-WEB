import { Component, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ValidadorDeclaracionService } from '../../../services/validador-declaracion.service';

interface MandatoEspecial {
  tipoMandato: string;
  notaria: string;
  fecha: string;
}

@Component({
  selector: 'app-paso-12-mandato-especial',
  templateUrl: './paso-12-mandato-especial.component.html',
  styleUrls: ['./paso-12-mandato-especial.component.scss']
})
export class Paso12MandatoEspecialComponent {
  tieneMandato = 'no';

  mandatosData: MandatoEspecial[] = [
    { tipoMandato: 'ESPECIAL', notaria: 'Notaría XYZ', fecha: '01/02/2023' }
  ];

  @ViewChild('mandatoModal') mandatoModal!: TemplateRef<any>;
  mandatoForm!: FormGroup;
  editMode = false;
  currentItem: MandatoEspecial | null = null;
  dialogRef: MatDialogRef<any> | null = null;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private validadorDeclaracionService: ValidadorDeclaracionService
  ) {
    // Marca "paso12" como completo si ya hay datos
    this.validadorDeclaracionService.setPasoCompleto('paso12', this.mandatosData.length > 0);
  }

  // Manejo de la pregunta "¿Tiene Mandato?"  
  onTieneMandatoChange(value: string) {
    this.tieneMandato = value;
    if (value === 'no') {
      // Puedes limpiar la lista si así lo deseas
      // this.mandatosData = [];
      this.validadorDeclaracionService.setPasoCompleto('paso12', false);
    } else {
      // "sí"
      this.validadorDeclaracionService.setPasoCompleto('paso12', this.mandatosData.length > 0);
    }
  }

  openAddModal() {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.dialogRef = this.dialog.open(this.mandatoModal);
  }

  openEditModal(item: MandatoEspecial) {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.dialogRef = this.dialog.open(this.mandatoModal);
  }

  buildForm(item?: MandatoEspecial) {
    this.mandatoForm = this.fb.group({
      tipoMandato: [item?.tipoMandato || 'ESPECIAL', Validators.required],
      notaria: [item?.notaria || '', Validators.required],
      fecha: [item?.fecha || '', Validators.required]
    });
  }

  saveMandato(dialogRef: any) {
    if (this.mandatoForm.invalid) {
      this.validadorDeclaracionService.setPasoCompleto('paso12', false);
      return;
    }

    const formValue = this.mandatoForm.value as MandatoEspecial;
    if (this.editMode && this.currentItem) {
      const i = this.mandatosData.indexOf(this.currentItem);
      if (i >= 0) {
        this.mandatosData[i] = formValue;
      }
    } else {
      this.mandatosData.push(formValue);
    }
    dialogRef.close();

    this.validadorDeclaracionService.setPasoCompleto('paso12', this.mandatosData.length > 0);
  }

  eliminarMandato(m: MandatoEspecial) {
    this.mandatosData = this.mandatosData.filter(x => x !== m);
    this.validadorDeclaracionService.setPasoCompleto('paso12', this.mandatosData.length > 0);
  }
}
