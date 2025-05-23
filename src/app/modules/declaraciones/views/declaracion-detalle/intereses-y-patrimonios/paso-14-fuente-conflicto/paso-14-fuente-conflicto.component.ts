import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';
import { OtraFuenteService } from 'src/app/modules/declaraciones/services/otra-fuente.service';
import { DeclaracionService } from 'src/app/modules/declaraciones/services/declaracion.service';
import { ToastrService } from 'ngx-toastr';

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

  displayedColumns = ['fuenteConflicto', 'observaciones', 'estado', 'acciones'];

  tieneFuenteConflicto = '';
  conflictos: any[] = [];
  conflictoForm!: FormGroup;
  editMode = false;
  currentItem: any | null = null;
  private dialogRef: any;

  private activeDeclId!: string;
  private readonly key = 'paso14';

  otrasFuentes: any[] = [];

  declaracionId: number = this._declaracionHelper.declaracionId;
  declaranteId: number = this._declaracionHelper.declaranteId;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _otraFuente: OtraFuenteService,
    private _declaracionHelper: DeclaracionHelperService,
    private _declaracion: DeclaracionService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this._declaracionHelper.activeId$.subscribe(id => this.activeDeclId = id);
    // this._declaracionHelper.markStepIncomplete(['declaraciones', this.activeDeclId, this.key]);

    this.loadOtrasFuentes();
  }

  ngAfterViewInit(): void {
    this.loadRegistro();
  }

  loadRegistro() {
    this._declaracionHelper.declaracionesFlag$.subscribe(data => {
      if(data.otraFuente != undefined) {
        this.tieneFuenteConflicto = data.otraFuente ? 'si' : 'no';
      }
    });
  }

  loadOtrasFuentes() {
    this._otraFuente.listar(this.declaranteId).subscribe({
      next: (res: any) => {
        this.otrasFuentes = res;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Error al cargar las fuentes de conflicto');
      }
    });
  }

  buildForm(item?: any): void {
    this.conflictoForm = this.fb.group({
      fuenteConflicto: [item?.fuenteConflicto || ''],
      observaciones: [item?.observaciones || '']
    });
  }

  openAddModal() {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.dialogRef = this.dialog.open(this.conflictoModal, {
      width: '600px'
    });
  }

  openEditModal(item: any) {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.dialogRef = this.dialog.open(this.conflictoModal, {
      width: '600px'
    });
  }

  saveFuente() {


    const formData = this.conflictoForm.value;

    const obj = {
      id: this.editMode ? this.currentItem.id : '',
      fuenteConflicto: formData.fuenteConflicto,
      observaciones: formData.observaciones,
      borrador: !this.isFormValid(this.conflictoForm)
    }
    this._otraFuente.guardar(obj, this.declaranteId).subscribe({
      next: (res: any) => {
        this.loadOtrasFuentes();
        this.closeDialog();
        this.toastr.success('Fuente de conflicto guardada exitosamente');
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Error al guardar la fuente de conflicto');
      }
    });
  }

  eliminarFuente(item: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la fuente de conflicto seleccionada.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._otraFuente.eliminar(item.id).subscribe({
          next: (res: any) => {
            this.loadOtrasFuentes();
            this.toastr.success('Fuente de conflicto eliminada exitosamente');
          },
          error: (err) => {
            console.error(err);
            this.toastr.error('Error al eliminar la fuente de conflicto');
          }
        });
      }
    });
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  onTieneFuenteConflictoChange(value: string): void {
    if (value === 'no' && this.conflictoForm?.valid) {
      Swal.fire({
        title: 'No se puede cambiar',
        text: 'Debe eliminar todos los registros antes de cambiar a "No Tiene"',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      this.tieneFuenteConflicto = 'si';
      return;
    }
    this.tieneFuenteConflicto = value;
    const path = ['declaraciones', this.activeDeclId, 'paso14'];
    this._declaracion.guardarRegistro(this.declaranteId, 'otraFuente', value === 'si').subscribe({
      next: (res: any) => {
        console.log('Registro guardado exitosamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
        this.toastr.error('Error al guardar registro');
      }
    });
  }

  onSubmit() {
    const ok = this.tieneFuenteConflicto === 'no' || 
              (this.tieneFuenteConflicto === 'si' && this.otrasFuentes.length > 0);

    if (ok) {
      this._declaracionHelper.markStepCompleted(['declaraciones', this.activeDeclId, this.key]);
      this._declaracionHelper.nextStep();
    } else {
      this._declaracionHelper.markStepIncomplete(['declaraciones', this.activeDeclId, this.key]);
    }
  }

   private isFormValid(ctrl: any): boolean {
      if (ctrl instanceof FormControl) {
        const v = ctrl.value;
        return v !== null && v !== undefined && String(v).trim() !== '';
      }
  
      if (ctrl instanceof FormGroup) {
        return Object.values(ctrl.controls).every(child => this.isFormValid(child));
      }
  
      if (ctrl instanceof FormArray) {
        return ctrl.controls.every(child => this.isFormValid(child));
      }
      return true;
    }
}
