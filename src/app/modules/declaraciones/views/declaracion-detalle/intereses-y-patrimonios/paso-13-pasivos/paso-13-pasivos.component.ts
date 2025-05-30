import { ServicioService } from '../../../../services/servicio.service';
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

import { PasivosService } from 'src/app/modules/declaraciones/services/pasivos.service';
import { PensionesService } from 'src/app/modules/declaraciones/services/pensiones.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';
import { DeclaracionService } from 'src/app/modules/declaraciones/services/declaracion.service';

interface PasivoItem {
  id?: string;
  tipoId: number;
  monto: string;
  razonSocial: string;
  borrador: boolean;
}

interface PensionItem {
  id?: string;
  monto: string;
  registroNacional: boolean;
  borrador: boolean;
}

@Component({
  selector: 'app-paso-13-pasivos',
  standalone: false,
  templateUrl: './paso-13-pasivos.component.html',
  styleUrls: ['./paso-13-pasivos.component.scss']
})
export class Paso13PasivosComponent implements OnInit {
  @ViewChild('pasivoModal') pasivoModal!: TemplateRef<any>;
  @ViewChild('pensionModal') pensionModal!: TemplateRef<any>;

  displayedColumnsPensiones = ['monto', 'registroNacional', 'estado', 'acciones'];
  displayedColumnsPasivos = ['tipoObligacion', 'monto', 'razonSocial', 'estado', 'acciones'];

  tienePasivos = '';
  tieneDeudaPension = '';

  pasivoForm!: FormGroup;
  pensionForm!: FormGroup;

  editPasivoMode = false;
  editPensionMode = false;

  currentPasivoItem: PasivoItem | null = null;
  currentPensionItem: PensionItem | null = null;

  private dialogRef: any;

  private activeDeclId!: string;

  montoGlobal: any;

  deduasPensionAlimento: any[] = [];
  deudasMayor100UTM: any[] = [];

  tipoObligacion: any[] = [];

  declaracionId: number = this._declaracionHelper.declaracionId;
  declaranteId: number = this._declaracionHelper.declaranteId;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _pasivos: PasivosService,
    private _pensiones: PensionesService,
    private _servicioPublico: ServicioService,
    private _declaracionHelper: DeclaracionHelperService,
    private _declaracion: DeclaracionService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.buildForms();
    this._declaracionHelper.activeId$.subscribe(id => this.activeDeclId = id);

    this.loadDeudas();
    this.loadDeudasMayor100UTM();
    this.loadTipoObligacion();
    this.loadRegistro();
  }

  ngAfterViewInit(): void {
    this.loadRegistro();
  }

  buildForms(): void {
    this.pasivoForm = this.fb.group({
      id: [''],
      tipoId: [null],
      monto: [''],
      razonSocial: [''],
      borrador: [false]
    });

    this.pensionForm = this.fb.group({
      id: [''],
      monto: [''],
      registroNacional: [false],
      borrador: [false]
    });
  }

  loadRegistro() {
    this._declaracionHelper.declaracionesFlag$.subscribe(data => {
      if (data.pasivos != undefined) {
        this.tienePasivos = data.pasivos ? 'si' : 'no';
      }
      if (data.pensiones != undefined) {
        this.tieneDeudaPension = data.pensiones ? 'si' : 'no';
      }
      if (data.pasivos != undefined) {
        this.tienePasivos = data.pasivos ? 'si' : 'no';
      }
      if (data.pensiones != undefined) {
        this.tieneDeudaPension = data.pensiones ? 'si' : 'no';
      }
    });
  }

  loadDeudas() {
    this._pasivos.listar(this.declaranteId).subscribe({
      next: (res: any) => {
        this.deduasPensionAlimento = res;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Error al cargar las deudas');
      }
    });
  }

  loadDeudasMayor100UTM() {
    this._pensiones.listar(this.declaranteId).subscribe({
      next: (res: any) => {
        this.deudasMayor100UTM = res;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Error al cargar las deudas mayores a 100 UTM');
      }
    });
  }

  loadTipoObligacion() {
    this._servicioPublico.listarServiciosPublicos("tipoObligacion").subscribe({
      next: (res: any) => {
        this.tipoObligacion = res;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Error al cargar los tipos de obligación');
      }
    });
  }

  onTieneDeudaPensionChange(value: string): void {
    this.tieneDeudaPension = value;
    this._declaracion.guardarRegistro(this.declaranteId, 'pensiones', value === 'si').subscribe({
      next: (res: any) => {
        this.toastr.success('Registro actualizado exitosamente');
        this._declaracionHelper.validateFlagsForInteresesSteps();
        this._declaracionHelper.validateFlagsForInteresesSteps();
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
        this.toastr.error('Error al actualizar el registro');
      }
    });
  }

  onTienePasivosChange(value: string): void {
    if (value === 'no' && this.pasivoForm?.valid) {
      Swal.fire({
        title: 'No se puede cambiar',
        text: 'Debe eliminar todos los registros antes de cambiar a "No Tiene"',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      this.tienePasivos = 'si';
      return;
    }
    if (value === 'no' && this.pasivoForm?.valid) {
      Swal.fire({
        title: 'No se puede cambiar',
        text: 'Debe eliminar todos los registros antes de cambiar a "No Tiene"',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      this.tienePasivos = 'si';
      return;
    }
    this.tienePasivos = value;
    const path = ['declaraciones', this.activeDeclId, 'paso13'];
    this._declaracion.guardarRegistro(this.declaranteId, 'pasivos', value === 'si').subscribe({
      next: (res: any) => {
        console.log('Registro guardado exitosamente');
        this._declaracionHelper.validateFlagsForInteresesSteps();
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
        this.toastr.error('Error al guardar registro');
        this.toastr.error('Error al guardar registro');
      }
    });
  }

  onSubmit(): void {
    const ok = this.tienePasivos === 'si' ? this.pasivoForm.valid : true;

    if (ok) {
      this._declaracionHelper.markStepCompleted(['declaraciones', 'paso13']);
      this._declaracionHelper.nextStep();
    } else {
      this._declaracionHelper.markStepIncomplete(['declaraciones', 'paso13']);
      this._declaracionHelper.nextStep();
    }
  }

  openAddPasivoModal(): void {
    this.editPasivoMode = false;
    this.currentPasivoItem = null;
    this.pasivoForm.reset({ borrador: false });
    this.dialogRef = this.dialog.open(this.pasivoModal, { width: '800px' });
  }

  openEditPasivoModal(item: PasivoItem): void {
    this.editPasivoMode = true;
    this.currentPasivoItem = item;
    this.pasivoForm.patchValue(item);
    this.dialogRef = this.dialog.open(this.pasivoModal, { width: '800px' });
  }

  openAddPensionModal(): void {
    this.editPensionMode = false;
    this.currentPensionItem = null;
    this.pensionForm.reset({ borrador: false, registroNacional: false });
    this.dialogRef = this.dialog.open(this.pensionModal, { width: '800px' });
  }

  openEditPensionModal(item: PensionItem): void {
    this.editPensionMode = true;
    this.currentPensionItem = item;
    this.pensionForm.patchValue(item);
    this.dialogRef = this.dialog.open(this.pensionModal, { width: '800px' });
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  savePasivo(): void {

    if (!this.pasivoForm.valid) {
      this.toastr.error('Por favor complete todos los campos obligatorios.');
      return;
    }

    const data = this.pasivoForm.value;
    const obj = {
      id: this.editPasivoMode ? data.id : '',
      tipoId: data.tipoId,
      monto: data.monto,
      razonSocial: data.razonSocial,
      borrador: !this.isFormValid(this.pasivoForm)
    };


    this._pasivos.guardarPasivo(this.declaranteId, obj).subscribe({
      next: (res: any) => {
        this.toastr.success('Pasivo guardado exitosamente');
        this.closeDialog();
        this.loadDeudas();
        this._declaracionHelper.validateFlagsForInteresesSteps();

      },
      error: (err: any) => {
        console.error('Error al guardar pasivo:', err);
        this.toastr.error('Error al guardar pasivo');
      }
    });
  }

  savePension(): void {
    if (!this.pensionForm.valid) {
      this.toastr.error('Por favor complete todos los campos obligatorios.');
      return;
    }


    const data = this.pensionForm.value;
    const obj = {
      id: this.editPensionMode ? data.id : '',
      monto: data.monto,
      registroNacional: data.registroNacional,
      borrador: !this.isFormValid(this.pensionForm)
    };



    this._pensiones.guardar(obj, this.declaranteId).subscribe({
      next: (res: any) => {
        this.toastr.success('Pensión guardada exitosamente');
        this.closeDialog();
        this.loadDeudasMayor100UTM();
        this._declaracionHelper.validateFlagsForInteresesSteps();
      },
      error: (err: any) => {
        console.error('Error al guardar pensión:', err);
        this.toastr.error('Error al guardar pensión');
      }
    });
  }

  eliminarPasivo(item: PasivoItem): void {
    if (!item.id) return;


    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede deshacer',

      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this._pasivos.eliminar(Number(item.id)).subscribe({
          next: (res: any) => {
            this.toastr.success('Pasivo eliminado exitosamente');
            this.loadDeudas();
            this._declaracionHelper.validateFlagsForInteresesSteps();
          },
          error: (err: any) => {
            console.error('Error al eliminar pasivo:', err);
            this.toastr.error('Error al eliminar el pasivo');
          }
        });
      }
    });
  }

  eliminarPension(item: PensionItem): void {
    if (!item.id) return;


    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this._pensiones.eliminar(Number(item.id)).subscribe({
          next: (res: any) => {
            this.toastr.success('Pensión eliminada exitosamente');
            this.loadDeudasMayor100UTM();
            this._declaracionHelper.validateFlagsForInteresesSteps();
          },
          error: (err: any) => {
            console.error('Error al eliminar pensión:', err);
            this.toastr.error('Error al eliminar la pensión');
          }
        });
      }
    });
  }

  onMontoGlobalChange(value: number): void {
    this._declaracion.guardarRegistroPasivo(this.declaranteId, 'pasivosGlobal', value).subscribe({
      next: (res: any) => {
        this.toastr.success('Monto global guardado exitosamente');
        this._declaracionHelper.validateFlagsForInteresesSteps();
      },
      error: (err: any) => {
        console.error('Error al guardar monto global:', err);
        this.toastr.error('Error al guardar monto global');
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
