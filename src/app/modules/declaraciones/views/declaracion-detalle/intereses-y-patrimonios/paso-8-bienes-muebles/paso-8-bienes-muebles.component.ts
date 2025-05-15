import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  TemplateRef,
  Optional,
  SkipSelf
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { BienMuebleService } from 'src/app/modules/declaraciones/services/bien-mueble.service';
import { LocalidadService } from 'src/app/modules/declaraciones/services/localidad.service';
import { ComunService } from 'src/app/modules/declaraciones/services/comun.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';
import { DeclaracionService } from 'src/app/modules/declaraciones/services/declaracion.service';
import { InmuebleService } from 'src/app/modules/declaraciones/services/inmueble.service';

interface Vehiculo {
  id?: string;
  tipoMotorizadoId: number;
  tipoVehiculoId: number;
  marcaId: number;
  modelo: string;
  anio: string;
  patente: string;
  numeroInscripcion: string;
  anioInscripcion: string;
  avaluoFiscal: string;
  porcentaje: number;
  gravamenId: number;
  borrador: boolean;
  noPropietario: boolean;
}

interface Aeronave {
  id?: string;
  tipoMotorizadoId: string;
  tipoVehiculoId: number;
  nombre: string;
  patente: string;
  marcaAeronave: string;
  modelo: string;
  anio: string;
  numeroInscripcion: string;
  anioInscripcion: string;
  tasacion: string;
  porcentaje: number;
  gravamenId: number;
  borrador: boolean;
  noPropietario: boolean;
}

interface Nave {
  id?: string;
  tipoMotorizadoId: string;
  tipoVehiculoId: number;
  nombre: string;
  patente: string;
  anio: string;
  numeroInscripcion: string;
  anioInscripcion: string;
  tasacion: string;
  porcentaje: number;
  gravamenId: number;
  tonelaje: string;
  borrador: boolean;
  noPropietario: boolean;
}

interface OtroBienMueble {
  id?: string;
  descripcion: string;
  numero: string;
  anio: string;
  valor: string;
  porcentaje: number;
  tipo: string;
  borrador: boolean;
  noPropietario: boolean;
}

@Component({
  selector: 'app-paso-8-bienes-muebles',
  templateUrl: './paso-8-bienes-muebles.component.html',
  standalone: false,
  styleUrls: ['./paso-8-bienes-muebles.component.scss']
})
export class Paso8BienesMueblesComponent implements OnInit, AfterViewInit {
  tieneVehiculos = 'no';
  tieneAeronaves = 'no';
  tieneNaves = 'no';
  tieneOtrosBienes = 'no';

  vehiculosData: any[] = [];
  aeronavesData: any[] = [];
  navesData: any[] = [];
  otrosBienesData: any[] = [];

  displayedColumnsVehiculos = ['tipoVehiculo', 'marca', 'modelo', 'anio', 'patente', 'numeroInscripcion', 'anioInscripcion', 'avaluoFiscal', 'estado', 'acciones'];
  displayedColumnsAeronaves = ['tipoVehiculo', 'nombre', 'patente', 'marcaAeronave', 'modelo', 'anio', 'numeroInscripcion', 'tasacion', 'gravamenes', 'estado', 'acciones'];
  displayedColumnsNaves = ['tipoVehiculo', 'nombre', 'patente', 'anio', 'numeroInscripcion', 'tasacion', 'gravamenes', 'estado', 'acciones'];
  displayedColumnsOtrosBienes = ['descripcion', 'numero', 'anio', 'valor', 'tipoRegistro', 'estado', 'acciones'];

  @ViewChild('vehiculoModal') vehiculoModal!: TemplateRef<any>;
  @ViewChild('aeronaveModal') aeronaveModal!: TemplateRef<any>;
  @ViewChild('naveModal') naveModal!: TemplateRef<any>;
  @ViewChild('otroBienModal') otroBienModal!: TemplateRef<any>;

  vehiculoForm!: FormGroup;
  aeronaveForm!: FormGroup;
  naveForm!: FormGroup;
  otroBienForm!: FormGroup;

  editVehiculo = false;
  editAeronave = false;
  editNave = false;
  editOtroBien = false;

  currentVehiculo: Vehiculo | null = null;
  currentAeronave: Aeronave | null = null;
  currentNave: Nave | null = null;
  currentOtroBien: OtroBienMueble | null = null;

  tiposVehiculo: any[] = [];
  tiposAeronave: any[] = [];
  tiposNave: any[] = [];
  marcas: any[] = [];
  gravamenesVehiculo: any[] = [];
  gravamenesAeronave: any[] = [];
  gravamenesNave: any[] = [];

  declaracionId: number = this._declaracionHelper.declaracionId;
  declaranteId: number = this._declaracionHelper.declaranteId;

  private dialogRef: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _bienMueble: BienMuebleService,
    private _localidad: LocalidadService,
    private _comun: ComunService,
    private _declaracionHelper: DeclaracionHelperService,
    private _declaracion: DeclaracionService,
    private _inmueble: InmuebleService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.buildForms();
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.loadRegistro();
  }

  loadRegistro() {
    this._declaracionHelper.declaracionesFlag$.subscribe(data => {
      if(data.vehiculos != undefined) {
        this.tieneVehiculos = data.vehiculos ? 'si' : 'no';
      }
      if(data.aeronaves != undefined) {
        this.tieneAeronaves = data.aeronaves ? 'si' : 'no';
      }
      if(data.naves != undefined) {
        this.tieneNaves = data.naves ? 'si' : 'no';
      }
      if(data.otrosBienes != undefined) {
        this.tieneOtrosBienes = data.otrosBienes ? 'si' : 'no';
      }
    })
  }

  loadData() {
    this.loadVehiculos();
    this.loadAeronaves();
    this.loadNaves();
    this.loadOtrosBienes();
    this.loadTiposVehiculo();
    this.loadMarcas();
    this.loadGravamenes();
  }

  loadVehiculos() {
    this._bienMueble.listarVehiculos([1,2], this.declaranteId).subscribe({
      next: (response: any) => {
        console.log(response)
        this.vehiculosData = response;
      },
      error: (err) => {
        console.error('Error al cargar vehículos:', err);
        this.toastr.error('Error al cargar vehículos');
      }
    });
  }

  loadAeronaves() {
    this._bienMueble.listarVehiculos([4], this.declaranteId).subscribe({
      next: (response: any) => {
        console.log(response)
        this.aeronavesData = response;
      },
      error: (err) => {
        console.error('Error al cargar aeronaves:', err);
        this.toastr.error('Error al cargar aeronaves');
      }
    });
  }

  loadNaves() {
    this._bienMueble.listarVehiculos([3], this.declaranteId).subscribe({
      next: (response: any) => {
        this.navesData = response;
      },
      error: (err) => {
        console.error('Error al cargar naves:', err);
        this.toastr.error('Error al cargar naves');
      }
    });
  }

  loadOtrosBienes() {
    this._bienMueble.listar(this.declaranteId).subscribe({
      next: (response: any) => {
        this.otrosBienesData = response;
      },
      error: (err) => {
        console.error('Error al cargar otros bienes:', err);
        this.toastr.error('Error al cargar otros bienes');
      }
    });
  }

  loadTiposVehiculo() {
    this._bienMueble.listarAtributosVehiculo('vehiculoTipo', 1).subscribe({
      next: (response: any) => {
        console.log(response)
        this.tiposVehiculo = response;
      },
      error: (err) => {
        console.error('Error al cargar tipos de vehículo:', err);
        this.toastr.error('Error al cargar tipos de vehículo');
      }
    });

    this._bienMueble.listarAtributosVehiculo('vehiculoTipo', 4).subscribe({
      next: (response: any) => {
        console.log(response)
        this.tiposAeronave = response;
      },
      error: (err) => {
        console.error('Error al cargar tipos de vehículo:', err);
        this.toastr.error('Error al cargar tipos de vehículo');
      }
    });

    this._bienMueble.listarAtributosVehiculo('vehiculoTipo', 3).subscribe({
      next: (response: any) => {
        console.log(response)
        this.tiposNave = response;
      },
      error: (err) => {
        console.error('Error al cargar tipos de vehículo:', err);
        this.toastr.error('Error al cargar tipos de vehículo');
      }
    });
  }

  loadMarcas() {
    this._bienMueble.listarAtributosVehiculo('vehiculoMarca', 1).subscribe({
      next: (response: any) => {
                console.log(response)
        this.marcas = response;
      },
      error: (err) => {
        console.error('Error al cargar marcas:', err);
        this.toastr.error('Error al cargar marcas');
      }
    });
  }

  loadGravamenes() {
    this._inmueble.listarAtributos('degravamen', 'VEHICULOS').subscribe({
      next: (response: any) => {
        this.gravamenesVehiculo = response;
      },
      error: (err) => {
        console.error('Error al cargar gravámenes:', err);
        this.toastr.error('Error al cargar gravámenes');
      }
    });

    this._inmueble.listarAtributos('degravamen', 'AERONAVES').subscribe({
      next: (response: any) => {
        this.gravamenesAeronave = response;
      },
      error: (err) => {
        console.error('Error al cargar gravámenes:', err);
        this.toastr.error('Error al cargar gravámenes');
      }
    });


    this._inmueble.listarAtributos('degravamen', 'NAVES_ARTEFACTOS').subscribe({
      next: (response: any) => {
        this.gravamenesNave = response;
      },
      error: (err) => {
        console.error('Error al cargar gravámenes:', err);
        this.toastr.error('Error al cargar gravámenes');
      }
    });

  }

  onSubmit(): void {
    const ok1 = this.tieneVehiculos === 'si' ? this.vehiculosData.length > 0 : true;
    const ok2 = this.tieneAeronaves === 'si' ? this.aeronavesData.length > 0 : true;
    const ok3 = this.tieneNaves === 'si' ? this.navesData.length > 0 : true;
    const ok4 = this.tieneOtrosBienes === 'si' ? this.otrosBienesData.length > 0 : true;
    const ok = ok1 && ok2 && ok3 && ok4;

    if (ok) {
      this._declaracionHelper.markStepCompleted(['declaraciones', 'paso8']);
      this._declaracionHelper.nextStep();
    } else {
      this._declaracionHelper.markStepIncomplete(['declaraciones', 'paso8']);
      this._declaracionHelper.nextStep();
    }
  }

  // Métodos para vehículos
  openAddVehiculoModal(): void {
    this.editVehiculo = false;
    this.currentVehiculo = null;
    this.buildVehiculoForm();
    this.dialogRef = this.dialog.open(this.vehiculoModal, { width: '800px' });
  }

  openEditVehiculoModal(item: Vehiculo): void {
    this.editVehiculo = true;
    this.currentVehiculo = item;
    this.buildVehiculoForm(item);
    this.dialogRef = this.dialog.open(this.vehiculoModal, { width: '800px' });
  }

  saveVehiculo(): void {
    if (this.vehiculoForm.valid) {
      const formValue = this.vehiculoForm.value;
      const payload = {
        id: this.editVehiculo ? this.currentVehiculo?.id : null,
        tipoMotorizadoId: 1,
        tipoVehiculoId: formValue.tipoVehiculoId || '',
        marcaId: formValue.marcaId || '',
        modelo: formValue.modelo || '',
        anio: formValue.anio || '',
        patente: formValue.patente || '',
        numeroInscripcion: formValue.numeroInscripcion || '',
        anioInscripcion: formValue.anioInscripcion || '',
        avaluoFiscal: formValue.avaluoFiscal || '',
        porcentaje: formValue.porcentaje || 100,
        gravamenId: formValue.gravamenId || '',
        borrador: !this.isFormValid(this.vehiculoForm),
        noPropietario: formValue.noPropietario || false
      };

      this._bienMueble.guardar(payload, this.declaranteId).subscribe({
        next: (res: any) => {
          this.loadVehiculos();
          this.toastr.success('Vehículo guardado correctamente');
          this.closeDialog();
        },
        error: (err) => {
          console.error('Error al guardar vehículo:', err);
          this.toastr.error('Error al guardar vehículo');
        }
      });
    }
  }

  eliminarVehiculo(item: Vehiculo): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el vehículo seleccionado.',
      icon: 'warning',
      showCancelButton: true,
    }).then(result => {
      if (result.isConfirmed) {
        this._bienMueble.eliminar(Number(item.id)).subscribe({
          next: () => {
            this.loadVehiculos();
            this.toastr.success('Vehículo eliminado correctamente');
          },
          error: (err) => {
            console.error('Error al eliminar vehículo:', err);
            this.toastr.error('Error al eliminar vehículo');
          }
        });
      }
    });
  }

  onTieneVehiculosChange(value: string): void {
    this.tieneVehiculos = value;
    this._declaracion.guardarRegistro(this.declaranteId, 'rgVehiculos', value === 'si').subscribe({
      next: (res: any) => {
        console.log('Registro guardado exitosamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
      }
    });
  }

  // Métodos para aeronaves
  openAddAeronaveModal(): void {
    this.editAeronave = false;
    this.currentAeronave = null;
    this.buildAeronaveForm();
    this.dialogRef = this.dialog.open(this.aeronaveModal, { width: '800px' });
  }

  openEditAeronaveModal(item: Aeronave): void {
    this.editAeronave = true;
    this.currentAeronave = item;
    this.buildAeronaveForm(item);
    this.dialogRef = this.dialog.open(this.aeronaveModal, { width: '800px' });
  }

  saveAeronave(): void {
    if (this.aeronaveForm.valid) {
      const formValue = this.aeronaveForm.value;
      const payload = {
        id: this.editAeronave ? this.currentAeronave?.id : null,
        tipoMotorizadoId: '4',
        tipoVehiculoId: formValue.tipoVehiculoId || '',
        nombre: formValue.nombre || '',
        patente: formValue.patente || '',
        marcaAeronave: formValue.marcaAeronave || '',
        modelo: formValue.modelo || '',
        anio: formValue.anio || '',
        numeroInscripcion: formValue.numeroInscripcion || '',
        anioInscripcion: formValue.anioInscripcion || '',
        tasacion: formValue.tasacion || '',
        porcentaje: formValue.porcentaje || 100,
        gravamenId: formValue.gravamenId || '',
        borrador: !this.isFormValid(this.aeronaveForm),
        noPropietario: formValue.noPropietario || false
      };

      this._bienMueble.guardar(payload, this.declaranteId).subscribe({
        next: (res: any) => {
          this.loadAeronaves();
          this.toastr.success('Aeronave guardada correctamente');
          this.closeDialog();
        },
        error: (err) => {
          console.error('Error al guardar aeronave:', err);
          this.toastr.error('Error al guardar aeronave');
        }
      });
    }
  }

  eliminarAeronave(item: Aeronave): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la aeronave seleccionada.',
      icon: 'warning',
      showCancelButton: true,
    }).then(result => {
      if (result.isConfirmed) {
        this._bienMueble.eliminar(Number(item.id)).subscribe({
          next: () => {
            this.loadAeronaves();
            this.toastr.success('Aeronave eliminada correctamente');
          },
          error: (err) => {
            console.error('Error al eliminar aeronave:', err);
            this.toastr.error('Error al eliminar aeronave');
          }
        });
      }
    });
  }
  onTieneAeronavesChange(value: string): void {
    this.tieneAeronaves = value;
    this._declaracion.guardarRegistro(this.declaranteId, 'rgAeronaves', value === 'si').subscribe({
      next: (res: any) => {
        console.log('Registro guardado exitosamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
      }
    });
  }
  // Métodos para naves
  openAddNaveModal(): void {
    this.editNave = false;
    this.currentNave = null;
    this.buildNaveForm();
    this.dialogRef = this.dialog.open(this.naveModal, { width: '800px' });
  }

  openEditNaveModal(item: Nave): void {
    this.editNave = true;
    this.currentNave = item;
    this.buildNaveForm(item);
    this.dialogRef = this.dialog.open(this.naveModal, { width: '800px' });
  }

  saveNave(): void {
    if (this.naveForm.valid) {
      const formValue = this.naveForm.value;
      const payload = {
        id: this.editNave ? this.currentNave?.id : null,
        tipoMotorizadoId: '3',
        tipoVehiculoId: formValue.tipoVehiculoId || '',
        nombre: formValue.nombre || '',
        patente: formValue.patente || '',
        anio: formValue.anio || '',
        numeroInscripcion: formValue.numeroInscripcion || '',
        anioInscripcion: formValue.anioInscripcion || '',
        tasacion: formValue.tasacion || '',
        porcentaje: formValue.porcentaje || 100,
        gravamenId: formValue.gravamenId || '',
        tonelaje: formValue.tonelaje || '',
        borrador: !this.isFormValid(this.naveForm),
        noPropietario: formValue.noPropietario || false
      };

      this._bienMueble.guardar(payload, this.declaranteId).subscribe({
        next: (res: any) => {
          this.loadNaves();
          this.toastr.success('Nave guardada correctamente');
          this.closeDialog();
        },
        error: (err) => {
          console.error('Error al guardar nave:', err);
          this.toastr.error('Error al guardar nave');
        }
      });
    }
  }

  eliminarNave(item: Nave): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la nave seleccionada.',
      icon: 'warning',
      showCancelButton: true,
    }).then(result => {
      if (result.isConfirmed) {
        this._bienMueble.eliminar(Number(item.id)).subscribe({
          next: () => {
            this.loadNaves();
            this.toastr.success('Nave eliminada correctamente');
          },
          error: (err) => {
            console.error('Error al eliminar nave:', err);
            this.toastr.error('Error al eliminar nave');
          }
        });
      }
    });
  }
  onTieneNavesChange(value: string): void {
    this.tieneNaves = value;
    this._declaracion.guardarRegistro(this.declaranteId, 'rgNaves', value === 'si').subscribe({
      next: (res: any) => {
        console.log('Registro guardado exitosamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
      }
    });
  }
  // Métodos para otros bienes
  openAddOtroBienModal(): void {
    this.editOtroBien = false;
    this.currentOtroBien = null;
    this.buildOtroBienForm();
    this.dialogRef = this.dialog.open(this.otroBienModal, { width: '800px' });
  }

  openEditOtroBienModal(item: OtroBienMueble): void {
    this.editOtroBien = true;
    this.currentOtroBien = item;
    this.buildOtroBienForm(item);
    this.dialogRef = this.dialog.open(this.otroBienModal, { width: '800px' });
  }

  saveOtroBien(): void {
    if (this.otroBienForm.valid) {
      const formValue = this.otroBienForm.value;
      const payload = {
        id: this.editOtroBien ? this.currentOtroBien?.id : null,
        descripcion: formValue.descripcion || '',
        numero: formValue.numero || '',
        anio: formValue.anio || '',
        valor: formValue.valor || '',
        porcentaje: formValue.porcentaje || 100,
        tipo: formValue.tipo || '',
        borrador: !this.isFormValid(this.otroBienForm),
        noPropietario: formValue.noPropietario || false
      };

      this._bienMueble.guardar(payload, this.declaranteId).subscribe({
        next: (res: any) => {
          this.loadOtrosBienes();
          this.toastr.success('Bien mueble guardado correctamente');
          this.closeDialog();
        },
        error: (err) => {
          console.error('Error al guardar bien mueble:', err);
          this.toastr.error('Error al guardar bien mueble');
        }
      });
    }
  }

  eliminarOtroBien(item: OtroBienMueble): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el bien mueble seleccionado.',
      icon: 'warning',
      showCancelButton: true,
    }).then(result => {
      if (result.isConfirmed) {
        this._bienMueble.eliminar(Number(item.id)).subscribe({
          next: () => {
            this.loadOtrosBienes();
            this.toastr.success('Bien mueble eliminado correctamente');
          },
          error: (err) => {
            console.error('Error al eliminar bien mueble:', err);
            this.toastr.error('Error al eliminar bien mueble');
          }
        });
      }
    });
  }
  onTieneOtrosBienesChange(value: string): void {
    this.tieneOtrosBienes = value;
    this._declaracion.guardarRegistro(this.declaranteId, 'bienMueble', value === 'si').subscribe({
      next: (res: any) => {
        console.log('Registro guardado exitosamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
      }
    });
  }
  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }


  private buildForms(): void {
    this.buildVehiculoForm();
    this.buildAeronaveForm();
    this.buildNaveForm();
    this.buildOtroBienForm();
  }

  private buildVehiculoForm(item?: Vehiculo): void {
    this.vehiculoForm = this.fb.group({
      tipoMotorizadoId: [item?.tipoMotorizadoId || ''],
      tipoVehiculoId: [item?.tipoVehiculoId || ''],
      marcaId: [item?.marcaId || ''],
      modelo: [item?.modelo || ''],
      anio: [item?.anio || ''],
      patente: [item?.patente || ''],
      numeroInscripcion: [item?.numeroInscripcion || ''],
      anioInscripcion: [item?.anioInscripcion || ''],
      avaluoFiscal: [item?.avaluoFiscal || ''],
      porcentaje: [item?.porcentaje || 100],
      gravamenId: [item?.gravamenId || ''],
      noPropietario: [item?.noPropietario || false]
    });
  }

  private buildAeronaveForm(item?: Aeronave): void {
    this.aeronaveForm = this.fb.group({
      tipoMotorizadoId: [item?.tipoMotorizadoId || ''],
      tipoVehiculoId: [item?.tipoVehiculoId || ''],
      nombre: [item?.nombre || ''],
      patente: [item?.patente || ''],
      marcaAeronave: [item?.marcaAeronave || ''],
      modelo: [item?.modelo || ''],
      anio: [item?.anio || ''],
      numeroInscripcion: [item?.numeroInscripcion || ''],
      anioInscripcion: [item?.anioInscripcion || ''],
      tasacion: [item?.tasacion || ''],
      porcentaje: [item?.porcentaje || 100],
      gravamenId: [item?.gravamenId || ''],
      noPropietario: [item?.noPropietario || false]
    });
  }

  private buildNaveForm(item?: Nave): void {
    this.naveForm = this.fb.group({
      tipoMotorizadoId: [item?.tipoMotorizadoId || ''],
      tipoVehiculoId: [item?.tipoVehiculoId || ''],
      nombre: [item?.nombre || ''],
      patente: [item?.patente || ''],
      anio: [item?.anio || ''],
      numeroInscripcion: [item?.numeroInscripcion || ''],
      anioInscripcion: [item?.anioInscripcion || ''],
      tasacion: [item?.tasacion || ''],
      porcentaje: [item?.porcentaje || 100],
      gravamenId: [item?.gravamenId || ''],
      tonelaje: [item?.tonelaje || ''],
      noPropietario: [item?.noPropietario || false]
    });
  }

  private buildOtroBienForm(item?: OtroBienMueble): void {
    this.otroBienForm = this.fb.group({
      descripcion: [item?.descripcion || ''],
      numero: [item?.numero || ''],
      anio: [item?.anio || ''],
      valor: [item?.valor || ''],
      porcentaje: [item?.porcentaje || 100],
      tipo: [item?.tipo || ''],
      noPropietario: [item?.noPropietario || false]
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
