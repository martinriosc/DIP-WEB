import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ValidadorDeclaracionService } from '../../../../services/validador-declaracion.service';
import { StepperStatusService }        from 'src/app/modules/declaraciones/services/stepper-status.service';
import { OtraFuenteService } from 'src/app/modules/declaraciones/services/otra-fuente.service';

interface FuenteConflicto {
  descripcion:   string;
  tipoConflicto: string;
}

@Component({
  selector: 'app-paso-14-fuente-conflicto',
  standalone: false,
  templateUrl: './paso-14-fuente-conflicto.component.html',
  styleUrls: ['./paso-14-fuente-conflicto.component.scss']
})
export class Paso14FuenteConflictoComponent implements OnInit {
  @ViewChild('conflictoModal') conflictoModal!: TemplateRef<any>;

  tieneFuenteConflicto = 'no';
  fuentesData: FuenteConflicto[] = [
    { descripcion: 'Tiene participación familiar en empresa X', tipoConflicto: 'FAMILIAR' }
  ];

  conflictoForm!: FormGroup;
  editMode = false;
  currentItem: FuenteConflicto | null = null;
  dialogRef: MatDialogRef<any> | null = null;

  private activeDeclId!: string;
  private readonly key = 'paso14';

  otrasFuentes: any[] = [];

  declaracionId: number = 1319527;    //1319527
  declaranteId: number = 2882000;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private validador: ValidadorDeclaracionService,
    private stepperState: StepperStatusService,
    private _otraFuente: OtraFuenteService
  ) {}


  ngOnInit(): void {
    // inicializa el form
    this.buildForm();
    // obtiene id de declaración activa
    this.stepperState.activeId$.subscribe(id => this.activeDeclId = id);
    // opcional: marca inicialmente incompleto
    this.validador.markIncomplete(this.key);
    this.stepperState.markStepIncomplete(['declaraciones', this.activeDeclId, this.key]);


    this.loadOtrasFuentes();
  }


  loadOtrasFuentes() {
    this._otraFuente.listar(this.declaranteId).subscribe({
      next: (res: any) => {
        console.log(res)
        this.otrasFuentes = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  /** Maneja Guardar/Siguiente */
  onSubmit(): void {
    const ok =
      this.tieneFuenteConflicto === 'no' ||
      (this.tieneFuenteConflicto === 'si' && this.fuentesData.length > 0);

    const path = ['declaraciones', this.activeDeclId, this.key];

    if (ok) {
      this.validador.markComplete(this.key);
      this.stepperState.markStepCompleted(path);
      this.stepperState.nextStep();
    } else {
      this.validador.markIncomplete(this.key);
      this.stepperState.markStepIncomplete(path);
    }
  }

  /** Radio “¿Tiene conflicto?” */
  onTieneConflictoChange(value: string): void {
    this.tieneFuenteConflicto = value;
    const path = ['declaraciones', this.activeDeclId, this.key];

    if (value === 'no') {
      this.validador.markComplete(this.key);
      this.stepperState.markStepCompleted(path);
    } else {
      if (this.fuentesData.length > 0) {
        this.validador.markComplete(this.key);
        this.stepperState.markStepCompleted(path);
      } else {
        this.validador.markIncomplete(this.key);
        this.stepperState.markStepIncomplete(path);
      }
    }
  }

  /** Abre modal para agregar */
  openAddModal(): void {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.dialogRef = this.dialog.open(this.conflictoModal, { width: '800px' });
  }

  /** Abre modal para editar */
  openEditModal(item: FuenteConflicto): void {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.dialogRef = this.dialog.open(this.conflictoModal, { width: '800px' });
  }

  /** Construye o reinicia el formulario */
  private buildForm(item?: FuenteConflicto): void {
    this.conflictoForm = this.fb.group({
      descripcion:   [item?.descripcion   || '',          Validators.required],
      tipoConflicto: [item?.tipoConflicto || 'FAMILIAR', Validators.required]
    });
  }

  /** Guarda o actualiza tras cerrar modal */
  saveFuente(dialogRef: MatDialogRef<any>): void {
    const path = ['declaraciones', this.activeDeclId, this.key];

    if (this.conflictoForm.invalid) {
      this.validador.markIncomplete(this.key);
      this.stepperState.markStepIncomplete(path);
      return;
    }

    const data = this.conflictoForm.value as FuenteConflicto;
    if (this.editMode && this.currentItem) {
      const idx = this.fuentesData.indexOf(this.currentItem);
      if (idx >= 0) this.fuentesData[idx] = data;
    } else {
      this.fuentesData.push(data);
    }

    // si hay al menos uno, marcamos completo
    this.validador.markComplete(this.key);
    this.stepperState.markStepCompleted(path);

    dialogRef.close();
  }

  /** Elimina un registro */
  eliminarFuente(item: FuenteConflicto): void {
    const path = ['declaraciones', this.activeDeclId, this.key];
    this.fuentesData = this.fuentesData.filter(x => x !== item);
    if (this.fuentesData.length > 0) {
      this.validador.markComplete(this.key);
      this.stepperState.markStepCompleted(path);
    } else {
      this.validador.markIncomplete(this.key);
      this.stepperState.markStepIncomplete(path);
    }
  }
}
