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
import {
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';

import { ValidadorDeclaracionService } from '../../../../services/validador-declaracion.service';
import { StepperStatusService }        from 'src/app/modules/declaraciones/services/stepper-status.service';
import { OtrosBienesService } from 'src/app/modules/declaraciones/services/otros-bienes.service';
import { ComunService } from 'src/app/modules/declaraciones/services/comun.service';

interface OtroBien {
  descripcion:   string;
  valorAprox:    number;
  observaciones: string;
}

@Component({
  selector: 'app-paso-15-otros-bienes',
  standalone: false,
  templateUrl: './paso-15-otros-bienes.component.html',
  styleUrls: ['./paso-15-otros-bienes.component.scss']
})
export class Paso15OtrosBienesComponent implements OnInit {
  @ViewChild('otrosBienesModal') otrosBienesModal!: TemplateRef<any>;

  tieneOtrosBienes    = 'no';
  otrosBienesData: OtroBien[] = [
    { descripcion: 'Colección de Arte', valorAprox: 2000000, observaciones: 'Cuadros de autor chileno' }
  ];

  otroBienForm!: FormGroup;
  editMode = false;
  currentItem: OtroBien | null = null;
  dialogRef: MatDialogRef<any> | null = null;

  private activeDeclId!: string;
  private readonly key = 'paso15';

  otrosBienes: any[] = [];
  tiposBienes:any[] = [];

  declaracionId: number = 1319527;    //1319527
  declaranteId: number = 2882000;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private validador: ValidadorDeclaracionService,
    private stepperState: StepperStatusService,
    private _otrosBienes: OtrosBienesService,
    private _comun: ComunService
  ) {}

  ngOnInit(): void {
    // construye formulario inicial
    this.buildForm();
    // obtiene declaración activa
    this.stepperState.activeId$.subscribe(id => this.activeDeclId = id);
    // opcional: marca inicialmente incompleto
    this.validador.markIncomplete(this.key);
    this.stepperState.markStepIncomplete(['declaraciones', this.activeDeclId, this.key]);

    this.loadOtrosBienes();
    this.loadTipoBien();
  }

  loadOtrosBienes(){
    this._otrosBienes.listar(this.declaracionId).subscribe({
      next: (data:any) => {
        this.otrosBienes = data;
      },
      error: (error) => {
        console.error('Error al cargar otros bienes:', error);
      }
    });
  }

  loadTipoBien(){
    this._comun.listarEntity('','TipoBien').subscribe({
      next: (data:any) => {
        this.tiposBienes = data;
      },
      error: (error) => {
        console.error('Error al cargar otros bienes:', error);
      }
    });
  }

  /** Maneja click “Guardar / Siguiente” */
  onSubmit(): void {
    const ok =
      this.tieneOtrosBienes === 'no' ||
      (this.tieneOtrosBienes === 'si' && this.otrosBienesData.length > 0);

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

  /** Radio “¿Tiene otros bienes?” */
  onTieneOtrosBienesChange(value: string): void {
    this.tieneOtrosBienes = value;
    const path = ['declaraciones', this.activeDeclId, this.key];

    if (value === 'no') {
      this.validador.markComplete(this.key);
      this.stepperState.markStepCompleted(path);
    } else {
      if (this.otrosBienesData.length > 0) {
        this.validador.markComplete(this.key);
        this.stepperState.markStepCompleted(path);
      } else {
        this.validador.markIncomplete(this.key);
        this.stepperState.markStepIncomplete(path);
      }
    }
  }

  /** Abre modal para agregar un nuevo bien */
  openAddModal(): void {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.dialogRef = this.dialog.open(this.otrosBienesModal, { width: '800px' });
  }

  /** Abre modal para editar un bien existente */
  openEditModal(item: OtroBien): void {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.dialogRef = this.dialog.open(this.otrosBienesModal, { width: '800px' });
  }

  /** Construye o resetea el formulario */
  private buildForm(item?: OtroBien): void {
    this.otroBienForm = this.fb.group({
      descripcion:   [item?.descripcion   || '', Validators.required],
      valorAprox:    [item?.valorAprox    || 0,  [Validators.required, Validators.min(0)]],
      observaciones: [item?.observaciones || '']
    });
  }

  /** Guarda o actualiza el bien tras cerrar modal */
  saveOtroBien(dialogRef: MatDialogRef<any>): void {
    const path = ['declaraciones', this.activeDeclId, this.key];

    if (this.otroBienForm.invalid) {
      this.validador.markIncomplete(this.key);
      this.stepperState.markStepIncomplete(path);
      return;
    }

    const data = this.otroBienForm.value as OtroBien;
    if (this.editMode && this.currentItem) {
      const idx = this.otrosBienesData.indexOf(this.currentItem);
      if (idx >= 0) this.otrosBienesData[idx] = data;
    } else {
      this.otrosBienesData.push(data);
    }

    // marca completo si hay al menos un registro
    this.validador.markComplete(this.key);
    this.stepperState.markStepCompleted(path);

    dialogRef.close();
  }

  /** Elimina un bien y actualiza estado */
  eliminarOtroBien(item: OtroBien): void {
    const path = ['declaraciones', this.activeDeclId, this.key];
    this.otrosBienesData = this.otrosBienesData.filter(x => x !== item);

    if (this.otrosBienesData.length > 0) {
      this.validador.markComplete(this.key);
      this.stepperState.markStepCompleted(path);
    } else {
      this.validador.markIncomplete(this.key);
      this.stepperState.markStepIncomplete(path);
    }
  }
}
