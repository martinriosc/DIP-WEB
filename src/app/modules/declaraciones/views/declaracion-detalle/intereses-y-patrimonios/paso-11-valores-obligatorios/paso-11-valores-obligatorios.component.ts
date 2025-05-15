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
import { ToastrService } from 'ngx-toastr';

import { ValoresObligatoriosService } from 'src/app/modules/declaraciones/services/valores-obligatorios.service';
import { LocalidadService } from 'src/app/modules/declaraciones/services/localidad.service';
import { MonedaService } from 'src/app/modules/declaraciones/services/moneda.service';
import { InmuebleService } from 'src/app/modules/declaraciones/services/inmueble.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';
import { DeclaracionService } from 'src/app/modules/declaraciones/services/declaracion.service';

interface ValorObligatorio {
  id?: string;
  tipoInstrumento: string;
  razonSocial: string;
  pais: string;
  fecha: string;
  monedaId: number;
  monto: string;
  gravamen: number;
  tipoValorId: number;
  borrador: boolean;
}

@Component({
  selector: 'app-paso-11-valores-obligatorios',
  standalone: false,
  templateUrl: './paso-11-valores-obligatorios.component.html',
  styleUrls: ['./paso-11-valores-obligatorios.component.scss']
})
export class Paso11ValoresObligatoriosComponent implements OnInit {
  @ViewChild('cuentasModal') cuentasModal!: TemplateRef<any>;
  @ViewChild('ahorrosModal') ahorrosModal!: TemplateRef<any>;
  @ViewChild('depositosModal') depositosModal!: TemplateRef<any>;
  @ViewChild('segurosModal') segurosModal!: TemplateRef<any>;

  displayedColumnsCuentas = ['tipoInstrumento', 'razonSocial', 'pais', 'fecha', 'monto', 'tipoMoneda', 'gravamen','estado', 'acciones'];
  displayedColumnsAhorros = ['tipoInstrumento', 'razonSocial', 'pais', 'fecha', 'monto', 'tipoMoneda', 'gravamen','estado', 'acciones'];
  displayedColumnsDepositos = ['tipoInstrumento', 'razonSocial', 'pais', 'fecha', 'monto', 'tipoMoneda', 'gravamen','estado', 'acciones'];
  displayedColumnsSeguros = ['tipoInstrumento','tipoSeguro', 'razonSocial', 'pais', 'fecha', 'monto', 'tipoMoneda', 'gravamen','estado', 'acciones'];

  tieneValoresObligatorios = 'no';
  valoresObligatoriosData: ValorObligatorio[] = [];
  valorForm!: FormGroup;
  editMode = false;
  currentItem: ValorObligatorio | null = null;
  private dialogRef: any;

  private activeDeclId!: string;

  tieneCuentasLibretas = 'no';
  tieneAhorrosPrevisionales = 'no';
  tieneDepositosPlazo = 'no';
  tieneSeguros = 'no';

  cuentasLibretas: any[] = [];
  ahorrosPrevisionales: any[] = [];
  depositosPlazo: any[] = [];
  seguros: any[] = [];

  tipoInstrumentos: any[] = [];
  paises: any[] = [];
  monedas: any[] = [];
  gravamenes: any[] = [];

  isSeguro = false;
  isCuentaLibreta = false;
  isAhorroPrevisional = false;
  isDepositoPlazo = false;

  declaracionId: number = this._declaracionHelper.declaracionId;
  declaranteId: number = this._declaracionHelper.declaranteId;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _valoresObligatorios: ValoresObligatoriosService,
    private _localidad: LocalidadService,
    private _moneda: MonedaService,
    private _inmueble: InmuebleService,
    private _declaracionHelper: DeclaracionHelperService,
    private _declaracion: DeclaracionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Construye el formulario inicial vacío
    this.buildForm();
    // Obtiene la declaración activa
    this._declaracionHelper.activeId$.subscribe(id => this.activeDeclId = id);

    this.loadValores();
    this.loadPaises();
    this.loadMonedas();
    // this.loadGravamenes();
    // this.loadTiposInstrumentos();
    
  }

  ngAfterViewInit(): void {
    this.loadRegistro();
  }

  
  loadRegistro(){
    this._declaracionHelper.declaracionesFlag$.subscribe(data => {
      if(data.cuentas != undefined) {
        this.tieneCuentasLibretas = data.cuentas ? 'si' : 'no';
      }
      if(data.ahorros != undefined) {
        this.tieneAhorrosPrevisionales = data.ahorros ? 'si' : 'no';
      }
      if(data.depositos != undefined) {
        this.tieneDepositosPlazo = data.depositos ? 'si' : 'no';
      }
      if(data.seguros != undefined) {
        this.tieneSeguros = data.seguros ? 'si' : 'no';
      }
      
      
    })
  }


  loadValores(){
    this._valoresObligatorios.listar(this.declaranteId, 1).subscribe({
      next: (res: any) => {
        
        this.cuentasLibretas = res;
      },
      error: (err) => {
        console.log(err);
      }
    })

    this._valoresObligatorios.listar(this.declaranteId, 2).subscribe({
      next: (res: any) => {
        
        this.ahorrosPrevisionales = res;
      },
      error: (err) => {
        console.log(err);
      }
    })

    this._valoresObligatorios.listar(this.declaranteId, 3).subscribe({
      next: (res: any) => {
        
        this.depositosPlazo = res;
      },
      error: (err) => {
        console.log(err);
      }
    })

    this._valoresObligatorios.listar(this.declaranteId, 4).subscribe({
      next: (res: any) => {
        
        this.seguros = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadTiposInstrumentos(tipoInstrumento: number){
    this._valoresObligatorios.listarTipoInstrumento(tipoInstrumento).subscribe({
      next: (res: any) => {
        
        this.tipoInstrumentos = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadPaises(){
    this._localidad.getPaisesExtranjeros().subscribe({
      next: (res: any) => {
        
        this.paises = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadMonedas(){
    this._moneda.listar().subscribe({
      next: (res: any) => {
        
        this.monedas = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadGravamen(tipoGravamen: string) {
    this._inmueble.listarAtributos('desgravamen', tipoGravamen).subscribe({
      next: (res: any) => {
        
        this.gravamenes = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  /** Maneja el click Guardar/Siguiente */
  onSubmit(): void {
    const ok1 = this.tieneCuentasLibretas === 'si' ? this.cuentasLibretas.length > 0 : true;
    const ok2 = this.tieneAhorrosPrevisionales === 'si' ? this.ahorrosPrevisionales.length > 0 : true;
    const ok3 = this.tieneDepositosPlazo === 'si' ? this.depositosPlazo.length > 0 : true;
    const ok4 = this.tieneSeguros === 'si' ? this.seguros.length > 0 : true;
    const ok = ok1 && ok2 && ok3 && ok4;
    if (ok) {
      this._declaracionHelper.markStepCompleted(['declaraciones', 'paso11']);
      this._declaracionHelper.nextStep();
    } else {
      this._declaracionHelper.markStepIncomplete(['declaraciones', 'paso11']);
      this._declaracionHelper.nextStep();
    }
  }

  /** Construye o reinicia el formulario de la modal */
  private buildForm(item?: ValorObligatorio): void {
    this.valorForm = this.fb.group({
      id: [item?.id || ''],
      tipoInstrumentoId: [item?.tipoInstrumento || ''],
      razonSocial: [item?.razonSocial || ''],
      paisId: [item?.pais || ''],
      fecha: [item?.fecha || ''],
      monedaId: [item?.monedaId || 1],
      monto: [item?.monto || ''],
      gravamenId: [item?.gravamen || 13],
      tipoValorId: [item?.tipoValorId || 1],
      borrador: [item?.borrador || true]
    });
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  /** Guarda o actualiza un registro desde la modal */
  saveValorOblig(): void {

const payload = {
   ...this.valorForm.value,              // ya incluye tipoValorId, borrador, etc.
   borrador: !this.isFormValid(this.valorForm),
};

this._valoresObligatorios
    .guardar(payload, this.declaranteId)
    .subscribe({
        next: _ => { this.loadValores(); this.closeDialog(); },
        error: _ => this.toastr.error('No se pudo guardar')
    });
  }

  /** Elimina un registro */
  eliminarValorOblig(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el registro seleccionado.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._valoresObligatorios.eliminar(Number(id)).subscribe({
          next: (res: any) => {
            this.loadValores();
            this.toastr.success('Registro eliminado exitosamente');
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            this.toastr.error('Error al eliminar el registro');
          }
        });
      }
    });
  }

  /** Abre modal para editar un registro */
  openEditModal(item: ValorObligatorio, tipo: number): void {
   this.editMode = true;
  this.isSeguro = (tipo===4);
  this.buildForm(item);
  this.loadTiposInstrumentos(tipo);
  this.loadGravamen('13');

  this.dialogRef = this.dialog.open(this.getTemplate(tipo), {width:'800px'});
  }

  /** Abre modal para agregar nuevo registro */
  openAddModal(tipo: number): void {
   this.editMode = false;
  this.isSeguro = (tipo===4);            // para mostrar campo extra "tipoSeguro"
  this.buildForm();                      // ← limpio
  this.valorForm.patchValue({ tipoValorId: tipo });   // ****
  this.loadTiposInstrumentos(tipo);      // combos
  this.loadGravamen('13');

  this.dialogRef = this.dialog.open(this.getTemplate(tipo), {width:'800px'});
  }


private getTemplate(tipo:number):TemplateRef<any>{
  switch(tipo){
    case 1: return this.cuentasModal;
    case 2: return this.ahorrosModal;
    case 3: return this.depositosModal;
    default:return this.segurosModal;
  }
}

  onTieneCuentasLibretaChange(value: string): void {
    if (value === 'no' && this.cuentasLibretas.length > 0) {
      Swal.fire({
        title: 'No se puede cambiar',
        text: 'Debe eliminar todos los registros antes de cambiar a "No Tiene"',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      this.tieneCuentasLibretas = 'si';
      return;
    }
    this.tieneCuentasLibretas = value;
    const path = ['declaraciones', this.activeDeclId, 'paso11'];
    this._declaracion.guardarRegistro(this.declaranteId, 'cuentas', value === 'si').subscribe({
      next: (res: any) => {
        console.log('Registro guardado exitosamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
        this.toastr.error('Error al guardar registro');
      }
    });
  }

  onTieneAhorrosPrevisionalesChange(value: string): void {
    if (value === 'no' && this.ahorrosPrevisionales.length > 0) {
      Swal.fire({
        title: 'No se puede cambiar',
        text: 'Debe eliminar todos los registros antes de cambiar a "No Tiene"',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      this.tieneAhorrosPrevisionales = 'si';
      return;
    }
    this.tieneAhorrosPrevisionales = value;
    const path = ['declaraciones', this.activeDeclId, 'paso11'];
    this._declaracion.guardarRegistro(this.declaranteId, 'ahorros', value === 'si').subscribe({
      next: (res: any) => {
        console.log('Registro guardado exitosamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
        this.toastr.error('Error al guardar registro');
      }
    });
  }

  onTieneDepositoAPlazoChange(value: string): void {
    if (value === 'no' && this.depositosPlazo.length > 0) {
      Swal.fire({
        title: 'No se puede cambiar',
        text: 'Debe eliminar todos los registros antes de cambiar a "No Tiene"',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      this.tieneDepositosPlazo = 'si';
      return;
    }
    this.tieneDepositosPlazo = value;
    const path = ['declaraciones', this.activeDeclId, 'paso11'];
    this._declaracion.guardarRegistro(this.declaranteId, 'depositos', value === 'si').subscribe({
      next: (res: any) => {
        console.log('Registro guardado exitosamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
        this.toastr.error('Error al guardar registro');
      }
    });
  }

  onTieneSegurosChange(value: string): void {
    if (value === 'no' && this.seguros.length > 0) {
      Swal.fire({
        title: 'No se puede cambiar',
        text: 'Debe eliminar todos los registros antes de cambiar a "No Tiene"',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      this.tieneSeguros = 'si';
      return;
    }
    this.tieneSeguros = value;
    const path = ['declaraciones', this.activeDeclId, 'paso11'];
    this._declaracion.guardarRegistro(this.declaranteId, 'seguros', value === 'si').subscribe({
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

