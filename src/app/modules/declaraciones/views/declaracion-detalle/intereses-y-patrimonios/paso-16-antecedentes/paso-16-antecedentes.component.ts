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
import { OtrosAntecedentesService } from 'src/app/modules/declaraciones/services/otros-antecedentes.service';
import { DeclaracionService } from 'src/app/modules/declaraciones/services/declaracion.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';

interface Antecedente {
  tipo: string;
  descripcion: string;
  fecha: string;
  observaciones: string;
  estado: string;
}

@Component({
  selector: 'app-paso-16-antecedentes',
  standalone: false,
  templateUrl: './paso-16-antecedentes.component.html',
  styleUrls: ['./paso-16-antecedentes.component.scss']
})
export class Paso16AntecedentesComponent implements OnInit {
  @ViewChild('antecedentesModal') antecedentesModal!: TemplateRef<any>;

  tieneAntecedentes = 'no';
  antecedentes: any[] = [];
  antecedentesForm!: FormGroup;
  editMode = false;
  currentItem: Antecedente | null = null;
  dialogRef: MatDialogRef<any> | null = null;

  private activeDeclId!: string;
  private readonly key = 'paso16';


  declaracionId: number = 1319527;    //1319527
  declaranteId: number = 2882000;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private validador: ValidadorDeclaracionService,
    private stepperState: StepperStatusService,
    private _otrosAntecedentes: OtrosAntecedentesService,
    private _declaracion: DeclaracionService,
    private _declaracionHelper: DeclaracionHelperService,
  ) {}

  ngOnInit(): void {
    // Inicializa el formulario vacío
    this.buildForm();
    // Obtiene el ID de la declaración activa
    this.stepperState.activeId$.subscribe(id => this.activeDeclId = id);
    // Marca inicialmente como incompleto
    this.validador.markIncomplete(this.key);
    this.stepperState.markStepIncomplete(
      ['declaraciones', this.activeDeclId, this.key]
    );

    this.loadOtrosAntecedentes();
  }


  ngAfterViewInit(): void {
    this.loadRegistro();
  }

  
  loadRegistro(){
    this._declaracionHelper.declaracionesFlag$.subscribe(data => {
      console.log(data)
      this.tieneAntecedentes = data.otrosAntecedentes ? 'si' : 'no';
    })
  }
  
  loadOtrosAntecedentes() {
    this._otrosAntecedentes.listar(this.declaracionId).subscribe({
      next: (data:any) => {
        console.log(data)
        this.antecedentes = data;
      },
      error: (error) => {
        console.error('Error al cargar otros antecedentes:', error);
      }
    });
  }

  /** Guardar y avanzar */
  onSubmit(): void {
    const ok =
      this.tieneAntecedentes === 'no' ||
      (this.tieneAntecedentes === 'si' && this.antecedentes.length > 0);

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

  /** Radio "¿Tiene antecedentes?" */
  onTieneAntecedentesChange(value: string): void {
    this.tieneAntecedentes = value;
    const path = ['declaraciones', this.activeDeclId, this.key];

    if (value === 'no') {
      this.validador.markComplete(this.key);
      this.stepperState.markStepCompleted(path);
    } else {
      if (this.antecedentes.length > 0) {
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
    this.dialogRef = this.dialog.open(this.antecedentesModal, { width: '800px' });
  }

  /** Abre modal para editar */
  openEditModal(item: Antecedente): void {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.dialogRef = this.dialog.open(this.antecedentesModal, { width: '800px' });
  }

  /** Construye o resetea el formulario */
  private buildForm(item?: Antecedente): void {
    this.antecedentesForm = this.fb.group({
      tipo: [item?.tipo || ''],
      descripcion: [item?.descripcion || ''],
      fecha: [item?.fecha || ''],
      observaciones: [item?.observaciones || ''],
      estado: [item?.estado || 'Activo']
    });
  }

  /** Guarda o actualiza un antecedente */
  saveAntecedente(dialogRef: any): void {
    const key = 'paso16';
    const path = ['declaraciones', this.activeDeclId, key];

    if (this.antecedentesForm.invalid) {
      this.validador.markIncomplete(key);
      this.stepperState.markStepIncomplete(path);
      return;
    }

    const a = this.antecedentesForm.value as any;
    if (this.editMode && this.currentItem) {
      const idx = this.antecedentes.indexOf(this.currentItem);
      if (idx >= 0) this.antecedentes[idx] = a;
    } else {
      this.antecedentes.push(a);
    }
    dialogRef.close();

    // Marca completo si hay al menos uno
    this.validador.markComplete(key);
    this.stepperState.markStepCompleted(path);
  }

  /** Elimina un antecedente */
  eliminarAntecedente(item: Antecedente): void {
    const path = ['declaraciones', this.activeDeclId, this.key];

    this.antecedentes = this.antecedentes.filter(x => x !== item);
    if (this.antecedentes.length > 0) {
      this.validador.markComplete(this.key);
      this.stepperState.markStepCompleted(path);
    } else {
      this.validador.markIncomplete(this.key);
      this.stepperState.markStepIncomplete(path);
    }
  }
}
