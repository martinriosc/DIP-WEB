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
import { StepperStatusService } from 'src/app/modules/declaraciones/services/stepper-status.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';
import { OtraFuenteService } from 'src/app/modules/declaraciones/services/otra-fuente.service';

interface FuenteConflicto {
  tipo: string;
  descripcion: string;
  fecha: string;
  observaciones: string;
  estado: string;
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
  conflictos: any[] = [];
  conflictoForm!: FormGroup;
  editMode = false;
  currentItem: any | null = null;
  dialogRef: MatDialogRef<any> | null = null;

  private activeDeclId!: string;
  private readonly key = 'paso14';

  otrasFuentes: any[] = [];

  declaracionId: number = 1319527;    //1319527
  declaranteId: number = 2882000;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _otraFuente: OtraFuenteService,
    private _declaracionHelper: DeclaracionHelperService
  ) { }


  ngOnInit(): void {
    // inicializa el form
    this.buildForm();
    // obtiene id de declaración activa
    this._declaracionHelper.activeId$.subscribe(id => this.activeDeclId = id);
    // opcional: marca inicialmente incompleto
    this._declaracionHelper.markStepIncomplete(['declaraciones', this.activeDeclId, this.key]);


    this.loadOtrasFuentes();
  }

  ngAfterViewInit(): void {
    this.loadRegistro();
  }


  loadRegistro() {
    this._declaracionHelper.declaracionesFlag$.subscribe(data => {
      
      this.tieneFuenteConflicto = data.otraFuente ? 'si' : 'no';
    })
  }


  loadOtrasFuentes() {
    this._otraFuente.listar(this.declaranteId).subscribe({
      next: (res: any) => {
        
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
      (this.tieneFuenteConflicto === 'si' && this.otrasFuentes.length > 0);

    if (ok) {
      this._declaracionHelper.markStepCompleted(['declaraciones', 'paso14']);
      this._declaracionHelper.nextStep();
    } else {
      this._declaracionHelper.markStepIncomplete(['declaraciones', 'paso14']);
      this._declaracionHelper.nextStep();
    }
  }

  /** Radio "¿Tiene conflicto?" */
  onTieneConflictoChange(value: string): void {
    this.tieneFuenteConflicto = value;
    const path = ['declaraciones', this.activeDeclId, this.key];

    if (value === 'no') {
      this._declaracionHelper.markStepCompleted(path);
    } else {
      if (this.otrasFuentes.length > 0) {
        this._declaracionHelper.markStepCompleted(path);
      } else {
        this._declaracionHelper.markStepIncomplete(path);
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
      tipo: [item?.tipo || ''],
      descripcion: [item?.descripcion || ''],
      fecha: [item?.fecha || ''],
      observaciones: [item?.observaciones || ''],
      estado: [item?.estado || 'Activo']
    });
  }

  /** Guarda o actualiza una fuente de conflicto */
  saveConflicto(dialogRef: any): void {
    const key = 'paso14';
    const path = ['declaraciones', this.activeDeclId, key];

    if (this.conflictoForm.invalid) {
      this._declaracionHelper.markStepIncomplete(path);
      return;
    }

    const c = this.conflictoForm.value as FuenteConflicto;
    if (this.editMode && this.currentItem) {
      const idx = this.conflictos.indexOf(this.currentItem);
      if (idx >= 0) this.conflictos[idx] = c;
    } else {
      this.conflictos.push(c);
    }
    dialogRef.close();

    // Marca completo si hay al menos uno
    this._declaracionHelper.markStepCompleted(path);
  }

  /** Elimina un registro */
  eliminarFuente(item: FuenteConflicto): void {
    const path = ['declaraciones', this.activeDeclId, this.key];
    this.conflictos = this.conflictos.filter(x => x !== item);
    if (this.conflictos.length > 0) {
      this._declaracionHelper.markStepCompleted(path);
    } else {
      this._declaracionHelper.markStepIncomplete(path);
    }
  }
}
