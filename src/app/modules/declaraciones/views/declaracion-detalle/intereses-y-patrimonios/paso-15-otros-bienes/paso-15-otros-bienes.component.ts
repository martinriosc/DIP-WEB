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

import { OtrosBienesService } from 'src/app/modules/declaraciones/services/otros-bienes.service';
import { ComunService } from 'src/app/modules/declaraciones/services/comun.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';
import { DeclaracionService } from 'src/app/modules/declaraciones/services/declaracion.service';

interface OtroBien {
  id?: string;
  tipoBienId: string;
  monto: string;
  descripcion: string;
  borrador: boolean;
}

@Component({
  selector: 'app-paso-15-otros-bienes',
  standalone: false,
  templateUrl: './paso-15-otros-bienes.component.html',
  styleUrls: ['./paso-15-otros-bienes.component.scss']
})
export class Paso15OtrosBienesComponent implements OnInit {
  @ViewChild('otrosBienesModal') otrosBienesModal!: TemplateRef<any>;

  displayedColumns = ['tipoBien', 'monto', 'descripcion','estado', 'acciones'];

  tieneOtrosBienes = 'no';
  otrosBienesForm!: FormGroup;
  editMode = false;
  currentItem: OtroBien | null = null;
  private dialogRef: any;

  private activeDeclId!: string;
  private readonly key = 'paso15';

  otrosBienes: OtroBien[] = [];
  tiposBienes: any[] = [];

  declaracionId: number = this._declaracionHelper.declaracionId;
  declaranteId: number = this._declaracionHelper.declaranteId;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _otrosBienes: OtrosBienesService,
    private _comun: ComunService,
    private _declaracionHelper: DeclaracionHelperService,
    private _declaracion: DeclaracionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this._declaracionHelper.activeId$.subscribe(id => this.activeDeclId = id);
    this._declaracionHelper.markStepIncomplete(['declaraciones', this.activeDeclId, this.key]);

    this.loadOtrosBienes();
    this.loadTipoBien();
  }

  ngAfterViewInit(): void {
    this.loadRegistro();
  }

  loadRegistro() {
    this._declaracionHelper.declaracionesFlag$.subscribe(data => {
      this.tieneOtrosBienes = data.otrosBienes ? 'si' : 'no';
    });
  }

  loadOtrosBienes() {
    this._otrosBienes.listar(this.declaranteId).subscribe({
      next: (data: any) => {
        this.otrosBienes = data;
      },
      error: (error) => {
        console.error('Error al cargar otros bienes:', error);
        this.toastr.error('Error al cargar otros bienes');
      }
    });
  }

  loadTipoBien() {
    this._comun.listarEntity('', 'TipoBien').subscribe({
      next: (data: any) => {
        this.tiposBienes = data;
      },
      error: (error) => {
        console.error('Error al cargar tipos de bien:', error);
        this.toastr.error('Error al cargar tipos de bien');
      }
    });
  }

  onSubmit(): void {
    const ok =
      this.tieneOtrosBienes === 'no' ||
      (this.tieneOtrosBienes === 'si' && this.otrosBienes.length > 0);

    if (ok) {
      this._declaracionHelper.markStepCompleted(['declaraciones', 'paso15']);
      this._declaracionHelper.nextStep();
    } else {
      this._declaracionHelper.markStepIncomplete(['declaraciones', 'paso15']);
      this._declaracionHelper.nextStep();
    }
  }

  onTieneOtrosBienesChange(value: string): void {
    this.tieneOtrosBienes = value;
    const path = ['declaraciones', this.activeDeclId, this.key];

    this._declaracion.guardarRegistro(this.declaranteId, 'otrosBienes', value === 'si').subscribe({
      next: (res: any) => {
        console.log('Registro guardado exitosamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
        this.toastr.error('Error al guardar registro');
      }
    });

    if (value === 'no') {
      this._declaracionHelper.markStepCompleted(path);
    } else {
      if (this.otrosBienes.length > 0) {
        this._declaracionHelper.markStepCompleted(path);
      } else {
        this._declaracionHelper.markStepIncomplete(path);
      }
    }
  }

  openAddModal(): void {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.dialogRef = this.dialog.open(this.otrosBienesModal, { width: '800px' });
  }

  openEditModal(item: OtroBien): void {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.dialogRef = this.dialog.open(this.otrosBienesModal, { width: '800px' });
  }

  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  private buildForm(item?: OtroBien): void {
    this.otrosBienesForm = this.fb.group({
      tipoBienId: [item?.tipoBienId || ''],
      monto: [item?.monto || ''],
      descripcion: [item?.descripcion || ''],
      borrador: [item?.borrador || true]
    });
  }

  saveOtroBien(): void {
    if (this.otrosBienesForm.valid) {
      const formValue = this.otrosBienesForm.value;
      const payload = {
        id: this.editMode ? this.currentItem?.id : '',
        tipoBienId: formValue.tipoBienId,
        monto: formValue.monto,
        descripcion: formValue.descripcion,
        borrador: !this.isFormValid(this.otrosBienesForm)
      };

      this._otrosBienes.guardar(payload, this.declaranteId).subscribe({
        next: (res: any) => {
          this.loadOtrosBienes();
          this.toastr.success('Otro bien guardado correctamente');
          this.closeDialog();
        },
        error: (err) => {
          console.error('Error al guardar otro bien:', err);
          this.toastr.error('Error al guardar otro bien');
        }
      });
    }
  }

  eliminarOtroBien(item: OtroBien): void {
    if (!item.id) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el bien seleccionado.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._otrosBienes.eliminar(Number(item.id)).subscribe({
          next: (res: any) => {
            this.loadOtrosBienes();
            this.toastr.success('Otro bien eliminado correctamente');
          },
          error: (err) => {
            console.error('Error al eliminar otro bien:', err);
            this.toastr.error('Error al eliminar otro bien');
          }
        });
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
