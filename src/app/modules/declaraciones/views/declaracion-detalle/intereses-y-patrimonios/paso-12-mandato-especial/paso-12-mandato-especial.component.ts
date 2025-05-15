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
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { ContratoService } from 'src/app/modules/declaraciones/services/contrato.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';
import { DeclaracionService } from 'src/app/modules/declaraciones/services/declaracion.service';

interface Contrato {
  id?: string;
  razonSocial: string;
  rut: string;
  fechaCelebracion: string;
  notaria: string;
  valor: string;
  borrador: boolean;
}

@Component({
  selector: 'app-paso-12-mandato-especial',
  standalone: false,
  templateUrl: './paso-12-mandato-especial.component.html',
  styleUrls: ['./paso-12-mandato-especial.component.scss']
})
export class Paso12MandatoEspecialComponent implements OnInit {
  @ViewChild('contratoModal') contratoModal!: TemplateRef<any>;
  private dialogRef: any;

  displayedColumns = ['razonSocial', 'rut', 'fechaCelebracion', 'notaria', 'valor', 'estado', 'acciones'];

  tieneMandato = 'no';
  contratoForm!: FormGroup;
  editMode = false;
  currentItem: Contrato | null = null;

  private activeDeclId!: string;
  contratos: Contrato[] = [];

  declaracionId: number = this._declaracionHelper.declaracionId;
  declaranteId: number = this._declaracionHelper.declaranteId;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _contratos: ContratoService,
    private _declaracionHelper: DeclaracionHelperService,
    private _declaracion: DeclaracionService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this._declaracionHelper.activeId$.subscribe(id => this.activeDeclId = id);
    this.loadContratos();
  }

  ngAfterViewInit(): void {
    this.loadRegistro();
  }

  loadRegistro() {
    this._declaracionHelper.declaracionesFlag$.subscribe(data => {
      if(data.contratos != undefined) {
        this.tieneMandato = data.contratos ? 'si' : 'no';
      }
    });
  }

  loadContratos() {
    this._contratos.listar(this.declaranteId).subscribe({
      next: (res: any) => {
        this.contratos = res || [];
      },
      error: (err) => {
        console.error('Error al cargar contratos:', err);
        this.toastr.error('Error al cargar los contratos');
      }
    });
  }

  buildForm(item?: Contrato): void {
    this.contratoForm = this.fb.group({
      id: [item?.id || ''],
      razonSocial: [item?.razonSocial || ''],
      rut: [item?.rut || ''],
      fechaCelebracion: [item?.fechaCelebracion || ''],
      notaria: [item?.notaria || ''],
      valor: [item?.valor || ''],
      borrador: [item?.borrador || true]
    });
  }

  openAddModal(): void {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.dialogRef = this.dialog.open(this.contratoModal, { width: '800px' });
  }

  openEditModal(item: Contrato): void {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.dialogRef = this.dialog.open(this.contratoModal, { width: '800px' });
  }

  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  saveContrato(): void {
 

    const data = this.contratoForm.value;
    const obj = {
      id: this.editMode ? data.id : '',
      razonSocial: data.razonSocial,
      rut: data.rut,
      fechaCelebracion: data.fechaCelebracion,
      notaria: data.notaria,
      valor: data.valor,
      borrador: !this.isFormValid(this.contratoForm)
    }
    this._contratos.guardar(obj, this.declaranteId).subscribe({
      next: (res: any) => {
        this.toastr.success('Contrato guardado exitosamente');
        this.closeDialog();
        this.loadContratos();
      },
      error: (err) => {
        console.error('Error al guardar contrato:', err);
        this.toastr.error('Error al guardar el contrato');
      }
    });
  }

  eliminarContrato(item: Contrato): void {
    if (!item.id) return;

    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._contratos.eliminar(Number(item.id)).subscribe({
          next: (res: any) => {
            this.toastr.success('Contrato eliminado exitosamente');
            this.loadContratos();
          },
          error: (err) => {
            console.error('Error al eliminar contrato:', err);
            this.toastr.error('Error al eliminar el contrato');
          }
        });
      }
    });
  }

  onSubmit(): void {
    const ok = this.tieneMandato === 'si' ? this.contratoForm?.valid : true;

    if (ok) {
      this._declaracionHelper.markStepCompleted(['declaraciones', 'paso12']);
      this._declaracionHelper.nextStep();
    } else {
      this._declaracionHelper.markStepIncomplete(['declaraciones', 'paso12']);
      this._declaracionHelper.nextStep();
    }
  }

  onTieneMandatoChange(value: string): void {
    if (value === 'no' && this.contratoForm?.valid) {
      Swal.fire({
        title: 'No se puede cambiar',
        text: 'Debe eliminar todos los registros antes de cambiar a "No Tiene"',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      this.tieneMandato = 'si';
      return;
    }
    this.tieneMandato = value;
    const path = ['declaraciones', this.activeDeclId, 'paso12'];
    this._declaracion.guardarRegistro(this.declaranteId, 'contratos', value === 'si').subscribe({
      next: (res: any) => {
        console.log('Registro guardado exitosamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
        this.toastr.error('Error al guardar registro');
      }
    });
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
