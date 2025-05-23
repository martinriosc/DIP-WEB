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
import {
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { OtrosAntecedentesService } from 'src/app/modules/declaraciones/services/otros-antecedentes.service';
import { DeclaracionService } from 'src/app/modules/declaraciones/services/declaracion.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';

interface Antecedente {
  id: string;
  descripcion: string;
  borrador: boolean;
}

@Component({
  selector: 'app-paso-16-antecedentes',
  standalone: false,
  templateUrl: './paso-16-antecedentes.component.html',
  styleUrls: ['./paso-16-antecedentes.component.scss']
})
export class Paso16AntecedentesComponent implements OnInit {
  @ViewChild('antecedentesModal') antecedentesModal!: TemplateRef<any>;

  displayedColumns = ['antecedente','estado', 'acciones'];

  tieneAntecedentes = '';
  antecedentes: Antecedente[] = [];
  antecedentesForm!: FormGroup;
  editMode = false;
  currentItem: Antecedente | null = null;
  dialogRef: MatDialogRef<any> | null = null;

  private activeDeclId!: string;
  private readonly key = 'paso16';

  declaracionId: number = this._declaracionHelper.declaracionId;
  declaranteId: number = this._declaracionHelper.declaranteId;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _otrosAntecedentes: OtrosAntecedentesService,
    private _declaracion: DeclaracionService,
    private _declaracionHelper: DeclaracionHelperService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this._declaracionHelper.activeId$.subscribe(id => this.activeDeclId = id);
    // this._declaracionHelper.markStepIncomplete(['declaraciones', this.activeDeclId, this.key]);

    this.loadOtrosAntecedentes();
    this.loadRegistro();
  }

  loadRegistro() {
    this._declaracionHelper.declaracionesFlag$.subscribe(data => {
<<<<<<< HEAD
      console.log("data", data.otrosAntecedentes)
=======
>>>>>>> 02caafeb59e9745fc1c6f120b7d5909560c4bdc2
      if(data.otrosAntecedentes != undefined) {
        this.tieneAntecedentes = data.otrosAntecedentes ? 'si' : 'no';
      }
    });
  }

  loadOtrosAntecedentes() {
    this._otrosAntecedentes.listar(this.declaranteId).subscribe({
      next: (data: any) => {
        this.antecedentes = data;
      },
      error: (error) => {
        console.error('Error al cargar otros antecedentes:', error);
        this.toastr.error('Error al cargar otros antecedentes');
      }
    });
  }

<<<<<<< HEAD
  onTieneAntecedentesChange(value: boolean): void {
    console.log("value", value)
    if (!value && this.antecedentes.length > 0) {
=======
  onTieneAntecedentesChange(value: string): void {
    if (value === 'no' && this.antecedentes.length > 0) {
>>>>>>> 02caafeb59e9745fc1c6f120b7d5909560c4bdc2
      Swal.fire({
        title: 'No se puede cambiar',
        text: 'Debe eliminar todos los registros antes de cambiar a "No Tiene"',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      this.tieneAntecedentes = 'si';
      return;
    }
<<<<<<< HEAD
    this.tieneAntecedentes = value ? 'si' : 'no';
    const path = ['declaraciones', this.activeDeclId, 'paso16'];
    this._declaracion.guardarRegistro(this.declaranteId, 'antecedentes', value).subscribe({
=======
    this.tieneAntecedentes = value;
    const path = ['declaraciones', this.activeDeclId, 'paso16'];
    this._declaracion.guardarRegistro(this.declaranteId, 'antecedentes', value === 'si').subscribe({
>>>>>>> 02caafeb59e9745fc1c6f120b7d5909560c4bdc2
      next: (res: any) => {
        console.log('Registro guardado exitosamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
        this.toastr.error('Error al guardar registro');
      }
    });
  }

  openAddModal(): void {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.dialogRef = this.dialog.open(this.antecedentesModal, { width: '800px' });
  }

  openEditModal(item: Antecedente): void {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.dialogRef = this.dialog.open(this.antecedentesModal, { width: '800px' });
  }

  private buildForm(item?: Antecedente): void {
    this.antecedentesForm = this.fb.group({
      id: [item?.id || ''],
      descripcion: [item?.descripcion || ''],
      borrador: [item?.borrador || false]
    });
  }

  saveAntecedente(dialogRef: any): void {


    const form = this.antecedentesForm.value;
    const payload = {
      id: this.editMode ? this.currentItem?.id : 0,
      descripcion: form.descripcion,
      borrador: !this.isFormValid(this.antecedentesForm)
    }
    
    this._otrosAntecedentes.guardar(payload, this.declaranteId).subscribe({
      next: (res: any) => {
        this.loadOtrosAntecedentes();
       this.closeDialog();
        this.toastr.success('Antecedente guardado exitosamente');
        
        const path = ['declaraciones', this.activeDeclId, this.key];
        if (this.antecedentes.length > 0) {
          this._declaracionHelper.markStepCompleted(path);
        } else {
          this._declaracionHelper.markStepIncomplete(path);
        }
      },
      error: (err: any) => {
        console.error('Error al guardar antecedente:', err);
        this.toastr.error('Error al guardar antecedente');
      }
    });
  }
  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
  eliminarAntecedente(item: Antecedente): void {
    if (!item.id) {
      this.toastr.error('No se puede eliminar el antecedente');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el antecedente seleccionado.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._otrosAntecedentes.eliminar(Number(item.id)).subscribe({
          next: (res: any) => {
            this.loadOtrosAntecedentes();
            this.toastr.success('Antecedente eliminado exitosamente');
            
            const path = ['declaraciones', this.activeDeclId, this.key];
            if (this.antecedentes.length > 0) {
              this._declaracionHelper.markStepCompleted(path);
            } else {
              this._declaracionHelper.markStepIncomplete(path);
            }
          },
          error: (err: any) => {
            console.error('Error al eliminar antecedente:', err);
            this.toastr.error('Error al eliminar antecedente');
          }
        });
      }
    });
  }

  onSubmit(): void {
    const ok =
      this.tieneAntecedentes === 'no' ||
      (this.tieneAntecedentes === 'si' && this.antecedentes.length > 0);

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
