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
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import { ComunidadValoresService } from 'src/app/modules/declaraciones/services/comunidad-valores.service';
import { MonedaService } from 'src/app/modules/declaraciones/services/moneda.service';
import { InmuebleService } from 'src/app/modules/declaraciones/services/inmueble.service';
import { LocalidadService } from 'src/app/modules/declaraciones/services/localidad.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';
import { DeclaracionService } from 'src/app/modules/declaraciones/services/declaracion.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

interface ValorItem {
  id?: string;
  tipoId: string;
  extranjero: boolean;
  tituloId: string;
  razonSocial: string;
  paisId?: string;
  fechaAdquisicion: string;
  cantidad: string;
  monedaId: string;
  valorCorriente: string;
  gravamenId: string;
  borrador: boolean;
  controlador: boolean;
}

@Component({
  selector: 'app-paso-10-valores',
  standalone: false,
  templateUrl: './paso-10-valores.component.html',
  styleUrls: ['./paso-10-valores.component.scss']
})
export class Paso10ValoresComponent implements OnInit {
  @ViewChild('valorModal') valorModal!: TemplateRef<any>;
  private dialogRef: any;

  displayedColumnsChile = ['titulo', 'razonSocial', 'fechaAdquisicion', 'cantidad', 'tipoMoneda', 'valorCorriente', 'estado', 'acciones'];
  displayedColumnsExtranjero = ['titulo', 'razonSocial', 'pais', 'fechaAdquisicion', 'cantidad', 'tipoMoneda', 'valorCorriente', 'estado', 'acciones'];

  tieneValoresChile = 'no';
  tieneValoresExtranjero = 'no';

  valorForm!: FormGroup;
  editMode = false;
  currentItem: ValorItem | null = null;
  isExtranjero = false;

  private activeDeclId!: string;

  valoresChile: any[] = [];
  valoresExtranjero: any[] = [];
  titulos: any[] = [];
  monedas: any[] = [];
  gravamenes: any[] = [];
  paises: any[] = [];

  declaracionId: number = this._declaracionHelper.declaracionId;
  declaranteId: number = this._declaracionHelper.declaranteId;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _comunidad: ComunidadValoresService,
    private _moneda: MonedaService,
    private _inmueble: InmuebleService,
    private _localidad: LocalidadService,
    private _declaracionHelper: DeclaracionHelperService,
    private _declaracion: DeclaracionService,
    private _toastr: ToastrService,
    private _spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this._declaracionHelper.activeId$.subscribe(id => this.activeDeclId = id);

    this.loadValores();
    this.loadPaises();
    this.loadMonedas();
    this.loadTitulos();
  }

  ngAfterViewInit(): void {
    this.loadRegistro();
  }

  loadRegistro() {
    this._declaracionHelper.declaracionesFlag$.subscribe(data => {
      if(data.instrumento != undefined) {
        this.tieneValoresChile = data.instrumento ? 'si' : 'no';
      }
      if(data.instrumentoExtranjero != undefined) {
        this.tieneValoresExtranjero = data.instrumentoExtranjero ? 'si' : 'no';
      }
    })
  }

  loadValores() {
    this._comunidad.listar(3, this.declaranteId, false).subscribe({
      next: (res: any) => {
        this.valoresChile = res;
      },
      error: (err) => {
        console.log(err);
      }
    })

    this._comunidad.listar(3, this.declaranteId, true).subscribe({
      next: (res: any) => {
        this.valoresExtranjero = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadPaises() {
    this._localidad.getPaisesExtranjeros().subscribe({
      next: (res: any) => {
        this.paises = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadMonedas() {
    this._moneda.listar().subscribe({
      next: (res: any) => {
        this.monedas = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadTitulos() {
    this._comunidad.listarTitulos().subscribe({
      next: (res: any) => {
        this.titulos = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onSubmit(): void {
    const ok1 = this.tieneValoresChile === 'si' ? this.valoresChile.length > 0 : true;
    const ok2 = this.tieneValoresExtranjero === 'si' ? this.valoresExtranjero.length > 0 : true;
    const ok = ok1 && ok2;

    if (ok) {
      this._declaracionHelper.markStepCompleted(['declaraciones', 'paso10']);
      this._declaracionHelper.nextStep();
    } else {
      this._declaracionHelper.markStepIncomplete(['declaraciones', 'paso10']);
      this._declaracionHelper.nextStep();
    }
  }

  openAddModal(isExtranjero: boolean = false): void {
    this.editMode = false;
    this.currentItem = null;
    this.isExtranjero = isExtranjero;
    this.buildForm();
    this.dialogRef = this.dialog.open(this.valorModal, { width: '800px' });
  }

  openEditModal(item: ValorItem, isExtranjero: boolean = false): void {
    this.editMode = true;
    this.currentItem = item;
    this.isExtranjero = isExtranjero;
    this.buildForm(item);
    this.dialogRef = this.dialog.open(this.valorModal, { width: '800px' });
  }

  private buildForm(item?: ValorItem): void {
    this.valorForm = this.fb.group({
      id: [item?.id || ''],
      tipoId: [item?.tipoId || ''],
      extranjero: [this.isExtranjero],
      paisId: [item?.paisId || ''],
      tituloId: [item?.tituloId || '', Validators.required],
      razonSocial: [item?.razonSocial || ''],
      fechaAdquisicion: [item?.fechaAdquisicion || ''],
      cantidad: [item?.cantidad || ''],
      monedaId: [item?.monedaId || ''],
      valorCorriente: [item?.valorCorriente || ''],
      gravamenId: [item?.gravamenId || '']
    });

    if (this.isExtranjero) {
      this.valorForm.get('paisId')?.setValidators([Validators.required]);
    }
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  saveValor(): void {

    const payload = {
      ...this.valorForm.value,
      tipoId: 3,                         // siempre "3" para Valores
      extranjero: this.isExtranjero,     // ← se envía correctamente
      borrador: !this.isFormValid(this.valorForm),
      controlador: false
    };


    this._comunidad.guardar(payload, this.declaranteId)
      .subscribe({
        next: _ => {
          this._toastr.success('Guardado correctamente');
          this.loadValores(); this.closeDialog();
        },
        error: _ => this._toastr.error('No se pudo guardar')
      });
  }

  eliminarValor(v: ValorItem): void {
   

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el valor seleccionado.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._comunidad.eliminar(v.id as string).subscribe({
          next: (res: any) => {
            this._toastr.success('Eliminado correctamente');

            this.loadValores();
          },
          error: (err) => {
            console.log(err);
            this._toastr.error('No se pudo eliminar');
          }
        });
      }
    });
  }

  onTieneValoresChileChange(value: string): void {
    if (value === 'no' && this.valoresChile.length > 0) {
      Swal.fire({
        title: 'No se puede cambiar',
        text: 'Debe eliminar todos los registros antes de cambiar a "No Tiene"',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      this.tieneValoresChile = 'si';
      return;
    }
    this.tieneValoresChile = value;
    const path = ['declaraciones', this.activeDeclId, 'paso10'];
    this._declaracion.guardarRegistro(this.declaranteId, 'instrumento', value === 'si').subscribe({
      next: (res: any) => {
        console.log('Registro guardado exitosamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
        this._toastr.error('Error al guardar registro');
      }
    });
  }

  onTieneValoresExtranjeroChange(value: string): void {
    if (value === 'no' && this.valoresExtranjero.length > 0) {
      Swal.fire({
        title: 'No se puede cambiar',
        text: 'Debe eliminar todos los registros antes de cambiar a "No Tiene"',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      this.tieneValoresExtranjero = 'si';
      return;
    }
    this.tieneValoresExtranjero = value;
    const path = ['declaraciones', this.activeDeclId, 'paso10'];
    this._declaracion.guardarRegistro(this.declaranteId, 'instrumentoExtranjero', value === 'si').subscribe({
      next: (res: any) => {
        console.log('Registro guardado exitosamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
        this._toastr.error('Error al guardar registro');
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
