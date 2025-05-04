import { Component, Optional, SkipSelf, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ValidadorDeclaracionService } from '../../../../services/validador-declaracion.service';
import { MatStepper } from '@angular/material/stepper';
import { StepperStatusService } from 'src/app/modules/declaraciones/services/stepper-status.service';
import { PersonaRelacionadaService } from 'src/app/modules/declaraciones/services/persona-relacionada.service';
import { DeclaracionService } from 'src/app/modules/declaraciones/services/declaracion.service';

interface Tutela {
  run: string;
  tipoRelacion: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
}

@Component({
  selector: 'app-paso-4-tutela',
  standalone: false,
  templateUrl: './paso-4-tutela.component.html',
  styleUrls: ['./paso-4-tutela.component.scss']
})
export class Paso4TutelaComponent {
  tieneHijosTutela: boolean = false;

  data: Tutela[] = [];

  @ViewChild('tutelaModal') tutelaModal!: TemplateRef<any>;
  tutelaForm!: FormGroup;
  editMode = false;
  currentItem: Tutela | null = null;

  declaracionId: number = 1319527;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _declaracion: DeclaracionService,
    private _personaRelacionada: PersonaRelacionadaService,
    private validadorDeclaracionService: ValidadorDeclaracionService,
    private stepperState: StepperStatusService,
    @Optional() @SkipSelf() private stepper?: MatStepper
  ) { }


  ngOnInit(): void {
    this.loadPersonasRelacionadas();
    this.loadParentescos();
    this.obtenerAplica();
  }

  obtenerAplica(){
    this._declaracion.obtenerAplica(this.declaracionId).subscribe({
      next: (response) => {
        console.log(response)
        this.tieneHijosTutela = response.data
      },
      error: (error) => {
        console.error('Error al cargar subnumerales:', error);
      }
    })
  }

  loadPersonasRelacionadas(): void {
    this._personaRelacionada.listar(this.declaracionId).subscribe({
      next: (response: any) => {
        console.log(response)
        this.data = response;
      },
      error: (error) => {
        console.error('Error al cargar personas relacionadas:', error);
      }
    })
  }

  loadParentescos(): void {
    this._personaRelacionada.listarParentescos(1).subscribe({
      next: (response: any) => {
        console.log(response)
        this.data = response;
      },
      error: (error) => {
        console.error('Error al cargar personas relacionadas:', error);
      }
    })
  }



  buildForm(item?: any) {
    console.log(item)
    this.tutelaForm = this.fb.group({
      run: [item?.rut || ''],
      tipoRelacion: [item?.tipoRelacion || 'PATRIA POTESTAD'],
      nombres: [item?.nombre || ''],
      apellidoPaterno: [item?.apellidoPaterno || ''],
      apellidoMaterno: [item?.apellidoMaterno || '']
    });
  }

  onSubmit(): void {
    // Validamos: si hay hijos, debe haber al menos uno en data
    const ok = this.tieneHijosTutela ? this.data.length > 0 : true;
    if (ok) {
      // 1) Marca paso completo en ambos servicios
      this.validadorDeclaracionService.markComplete('paso4');
      this.stepperState.markStepCompleted(['declarante', 'paso4']);
      // 2) Cambia de bloque a INTERESES y selecciona el primer paso allí
      this.stepperState.setActiveBlock('int');
    } else {
      // Marca paso incompleto si no cumple
      this.validadorDeclaracionService.markIncomplete('paso4');
      this.stepperState.markStepIncomplete(['declarante', 'paso4']);
    }
  }

  /** Abrir modal para Agregar */
  openAddModal() {
    this.buildForm();
    this.editMode = false;
    this.dialog.open(this.tutelaModal, { width: '850px' });
  }

  /** Abrir modal para Editar */
  openEditModal(item: Tutela) {
    this.buildForm(item);
    this.editMode = true;
    this.currentItem = item;
    this.dialog.open(this.tutelaModal, { width: '850px' });
  }

  /** Guardar Cambios en el modal */
  saveHijo(dialogRef: any) {
    if (this.tutelaForm.valid) {
      const formValue = this.tutelaForm.value as Tutela;
      if (this.editMode && this.currentItem) {
        const idx = this.data.indexOf(this.currentItem);
        if (idx >= 0) this.data[idx] = formValue;
      } else {
        this.data.push(formValue);
      }
      dialogRef.close();
      // Si al menos hay un hijo, marcamos automáticamente el paso válido
      this.validadorDeclaracionService.markComplete('paso4');
      this.stepperState.markStepCompleted(['declarante', 'paso4']);
    }
  }

  /** Eliminar un registro de hijos/tutela */
  eliminarHijo(item: Tutela) {
    this.data = this.data.filter(d => d !== item);
    // Si ya no quedan, marca paso incompleto
    if (this.tieneHijosTutela && this.data.length === 0) {
      this.validadorDeclaracionService.markIncomplete('paso4');
      this.stepperState.markStepIncomplete(['declarante', 'paso4']);
    }
  }

  /** Maneja cambio en “¿Tiene hijos/tutela?” */
  onTieneHijosChange(value: boolean) {
    this.tieneHijosTutela = value;
    if (!value) {
      // Si no tiene, consideramos completado sin data
      this.validadorDeclaracionService.markComplete('paso4');
      this.stepperState.markStepCompleted(['declarante', 'paso4']);
    }
  }
}
