import { Component, Optional, SkipSelf, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ValidadorDeclaracionService } from '../../../../services/validador-declaracion.service';
import { MatStepper } from '@angular/material/stepper';

interface Tutela {
  run: string;
  tipoRelacion: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
}

@Component({
  selector: 'app-paso-4-tutela',
  templateUrl: './paso-4-tutela.component.html',
  styleUrls: ['./paso-4-tutela.component.scss']
})
export class Paso4TutelaComponent {
  // Controla si tiene o no hijos/tutela
  tieneHijosTutela: boolean = false;

  // Datos de la tabla
  data: Tutela[] = [
    {
      run: '25757209-9',
      tipoRelacion: 'PATRIA POTESTAD',
      nombres: 'FRANCO',
      apellidoPaterno: 'CONTARDO',
      apellidoMaterno: 'VIVANCO'
    }
  ];

  // Modal
  @ViewChild('tutelaModal') tutelaModal!: TemplateRef<any>;
  tutelaForm!: FormGroup;
  editMode = false;   // Para saber si es modo "agregar" o "editar"
  currentItem: Tutela | null = null;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private validadorDeclaracionService: ValidadorDeclaracionService,
    @Optional() @SkipSelf() private stepper?: MatStepper
  ) {}

  onSubmit(): void {
    const ok = (this.data.length > 0 && this.tieneHijosTutela) || !this.tieneHijosTutela;
    const key = 'paso4';

    ok ? this.validadorDeclaracionService.markComplete(key)
      : this.validadorDeclaracionService.markIncomplete(key);

    if (ok && this.stepper) {
      this.stepper.next();
    }
  }

  // Abrir modal para Agregar
  openAddModal() {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.dialog.open(this.tutelaModal, {
      width: '850px'
    });
  }

  // Abrir modal para Editar
  openEditModal(item: Tutela) {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.dialog.open(this.tutelaModal);
  }

  // Construir Form
  buildForm(item?: Tutela) {
    this.tutelaForm = this.fb.group({
      run: [item?.run || ''],
      tipoRelacion: [item?.tipoRelacion || 'PATRIA POTESTAD'],
      nombres: [item?.nombres || ''],
      apellidoPaterno: [item?.apellidoPaterno || ''],
      apellidoMaterno: [item?.apellidoMaterno || '']
    });
  }

  // Guardar Cambios en el modal
  saveHijo(dialogRef: any) {
    if (this.tutelaForm.valid) {
      const formValue = this.tutelaForm.value as Tutela;

      if (this.editMode && this.currentItem) {
        // Editar
        const index = this.data.indexOf(this.currentItem);
        if (index >= 0) {
          this.data[index] = formValue;
        }
      } else {
        // Agregar
        this.data.push(formValue);
      }
      dialogRef.close();

      // Si se ingresa al menos un elemento, marcamos el paso como completo (o en la lógica que requieras)
      this.validadorDeclaracionService.setPasoCompleto('paso4', true);
    }
  }

  // Eliminar
  eliminarHijo(element: Tutela) {
    this.data = this.data.filter(d => d !== element);
  }

  // Controlar el cambio en la pregunta “¿Tiene hijos/tutela?”
  onTieneHijosChange(value: boolean) {
    this.tieneHijosTutela = value;
    // Si responde "No", vacía la lista (opcional) y marca incompleto, etc.
    if (!value) {
      // this.data = []; // si así lo requieres
      this.validadorDeclaracionService.setPasoCompleto('paso4', false);
    }
  }
}
