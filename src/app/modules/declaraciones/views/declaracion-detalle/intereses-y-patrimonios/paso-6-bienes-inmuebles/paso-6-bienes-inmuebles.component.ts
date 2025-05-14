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

import { InmuebleService } from 'src/app/modules/declaraciones/services/inmueble.service';
import { LocalidadService } from 'src/app/modules/declaraciones/services/localidad.service';
import { MonedaService } from 'src/app/modules/declaraciones/services/moneda.service';
import { MatStepper } from '@angular/material/stepper';
import { Declaracion } from 'src/app/shared/models/AllModels';
import { DeclaracionService } from 'src/app/modules/declaraciones/services/declaracion.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';
import { NgxSpinnerService } from 'ngx-spinner';

interface BienChile {
  id?: string;
  tabId: string;
  regionId: number;
  comunaId: number;
  calle: string;
  numero: string;
  departamento: string;
  numeroInscripcion: string;
  fojas: string;
  anio: string;
  rolAvaluoUno: string;
  rolAvaluoDos: string;
  conservadorId: number;
  avaluoFiscal: string;
  porcentaje: number;
  fechaAdquisicion: string;
  claseId: number;
  rbDomicilio: boolean;
  extranjero: boolean;
  borrador: boolean;
  controlador: boolean;
  rolAvaluo: string;
  noPropietario: boolean;
}

interface BienExtranjero {
  id?: string;
  tabId: string;
  paisId: number;
  ciudad: string;
  calle: string;
  numero: string;
  departamento: string;
  valor: string;
  tipoMonedaId: number;
  porcentaje: number;
  fechaAdquisicion: string;
  claseId: number;
  extranjero: boolean;
  borrador: boolean;
  controlador: boolean;
  noPropietario: boolean;
}

@Component({
  selector: 'app-paso-6-bienes-inmuebles',
  standalone: false,
  templateUrl: './paso-6-bienes-inmuebles.component.html',
  styleUrls: ['./paso-6-bienes-inmuebles.component.scss']
})
export class Paso6BienesInmueblesComponent implements OnInit, AfterViewInit {
  tieneChile = 'no';
  tieneExtranjero = 'no';

  bienesChile: any[] = [];
  displayedColumnsChile = [
    'region', 'comuna', 'direccion', 'inscripcion', 'fojas', 'anio', 'rolAvaluo', 'conservador', 'avaluo', 'fechaAdquisicion', 'estado', 'acciones'
  ];

  bienesExtranjero: any[] = [];
  displayedColumnsExtranjero = ['pais', 'ciudad', 'direccion', 'valorCorriente', 'tipoMoneda', 'fechaAdquisicion', 'formaPropiedad', 'domicilio', 'estado', 'acciones'];

  @ViewChild('bienChileModal') bienChileModal!: TemplateRef<any>;
  bienChileForm!: FormGroup;
  editChile = false;
  currentChile: BienChile | null = null;

  @ViewChild('bienExtranjeroModal') bienExtranjeroModal!: TemplateRef<any>;
  bienExtranjeroForm!: FormGroup;
  editExtranjero = false;
  currentExtranjero: BienExtranjero | null = null;

  regiones: any[] = [];
  comunas: any[] = [];

  conservadoresBienes: any[] = [];
  clasesPropiedad: any[] = [];
  formasPropiedad: any[] = [];
  paises: any[] = [];
  monedas: any[] = [];

  declaracionId: number = this._declaracionHelper.declaracionId;
  declaranteId: number = this._declaracionHelper.declaranteId;

  private dialogRef: any;

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild('modalChile') modalChile!: TemplateRef<any>;
  @ViewChild('modalExtranjero') modalExtranjero!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _inmueble: InmuebleService,
    private _localidad: LocalidadService,
    private _moneda: MonedaService,
    private _declaracionHelper: DeclaracionHelperService,
    private _declaracion: DeclaracionService,
    private toastr: ToastrService,
    private _spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.buildChileForm();
    this.buildExtranjeroForm();
    this.loadBienesInmuebles();
    this.loadBienesInmueblesExtranjero();
    this.loadRegiones();
    this.loadConservadorBienes();
    this.loadClasesPropiedad();
    this.loadPaises();
    this.loadMonedas();
  }

  ngAfterViewInit(): void {
    this.loadRegistro();
  }

  loadRegistro() {
    this._declaracionHelper.declaracionesFlag$.subscribe(data => {
      this.tieneExtranjero = data.bienesInmueblesExtranjero ? 'si' : 'no';
      this.tieneChile = data.bienesInmuebles ? 'si' : 'no';
    })
  }

  loadBienesInmuebles() {
    this._inmueble.listarBienesInmuebles(this.declaranteId).subscribe({
      next: (res: any) => {
        this.bienesChile = res;
      },
      error: (err) => {
        console.error('Error al cargar bienes inmuebles:', err);
        this.toastr.error('Error al cargar bienes inmuebles');
      }
    })
  }

  loadBienesInmueblesExtranjero() {
    this._inmueble.listarBienesInmueblesExtranjero(this.declaranteId).subscribe({
      next: (res: any) => {
        this.bienesExtranjero = res;
      },
      error: (err) => {
        console.error('Error al cargar bienes inmuebles extranjeros:', err);
        this.toastr.error('Error al cargar bienes inmuebles extranjeros');
      }
    })
  }

  loadRegiones() {
    this._localidad.getRegiones().subscribe({
      next: (response: any) => {
        this.regiones = response;
      },
      error: (error) => {
        console.error('Error al cargar regiones:', error);
        this.toastr.error('Error al cargar regiones');
      }
    })
  }

  loadComunas() {
    this._localidad.getComunasPorRegion(this.bienChileForm.value.regionId).subscribe({
      next: (response: any) => {
        this.comunas = response;
      },
      error: (error) => {
        console.error('Error al cargar comunas:', error);
        this.toastr.error('Error al cargar comunas');
      }
    })
  }

  loadConservadorBienes() {
    this._inmueble.listarAtributos('conservador').subscribe({
      next: (res: any) => {
        this.conservadoresBienes = res;
      },
      error: (err) => {
        console.error('Error al cargar conservadores:', err);
        this.toastr.error('Error al cargar conservadores');
      }
    })
  }

  loadClasesPropiedad() {
    this._inmueble.listarAtributos('clase').subscribe({
      next: (res: any) => {
        this.clasesPropiedad = res;
        this.formasPropiedad = res;
      },
      error: (err) => {
        console.error('Error al cargar clases de propiedad:', err);
        this.toastr.error('Error al cargar clases de propiedad');
      }
    })
  }

  loadPaises() {
    this._localidad.getPaisesExtranjeros().subscribe({
      next: (response: any) => {
        this.paises = response;
      },
      error: (error) => {
        console.error('Error al cargar países:', error);
        this.toastr.error('Error al cargar países');
      }
    })
  }

  loadMonedas() {
    this._moneda.listar().subscribe({
      next: (response) => {
        this.monedas = response.data;
      },
      error: (error) => {
        console.error('Error al cargar monedas:', error);
        this.toastr.error('Error al cargar monedas');
      }
    })
  }

  onSubmit(): void {
    const ok1 = this.tieneChile ? this.bienesChile.length > 0 : true;
    const ok2 = this.tieneExtranjero ? this.bienesExtranjero.length > 0 : true;
    const ok = ok1 && ok2;
    if (ok) {
      this._declaracionHelper.markStepCompleted(['declaraciones', 'paso6']);
      this._declaracionHelper.nextStep();
    } else {
      this._declaracionHelper.markStepIncomplete(['declaraciones', 'paso6']);
      this._declaracionHelper.nextStep();
    }
  }

  openAddChileModal(): void {
    this.editChile = false;
    this.currentChile = null;
    this.buildChileForm();
    this.dialogRef = this.dialog.open(this.bienChileModal, { width: '800px' });
  }

  openEditChileModal(item: BienChile): void {
    this.editChile = true;
    this.currentChile = item;
    this.buildChileForm(item);
    this.dialogRef = this.dialog.open(this.bienChileModal, { width: '800px' });
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  saveBienChile(): void {
    // if (this.bienChileForm.valid) {
    const formValue = this.bienChileForm.value;
    console.log(formValue)
    const payload = {
      id: this.editChile ? this.currentChile?.id : null,
      tabId: '1',
      regionId: formValue.regionId || '',
      comunaId: formValue.comunaId || '',
      calle: formValue.calle || '',
      numero: formValue.numero || '',
      departamento: formValue.departamento || '',
      numeroInscripcion: formValue.numeroInscripcion || '',
      fojas: formValue.fojas || '',
      anio: formValue.anio || '',
      rolAvaluoUno: formValue.rolAvaluoUno || '',
      rolAvaluoDos: formValue.rolAvaluoDos || '',
      conservadorId: formValue.conservadorId || '',
      avaluoFiscal: formValue.avaluoFiscal || '',
      porcentaje: formValue.porcentaje || 100,
      fechaAdquisicion: formValue.fechaAdquisicion ? formatDate(formValue.fechaAdquisicion, 'dd/MM/yyyy', 'es') : '',
      claseId: formValue.claseId || '',
      rbDomicilio: formValue.rbDomicilio || false,
      extranjero: false,
      borrador: !this.isFormValid(this.bienChileForm),
      controlador: false,
      rolAvaluo: formValue.rolAvaluoUno && formValue.rolAvaluoDos ? `${formValue.rolAvaluoUno}-${formValue.rolAvaluoDos}` : '',
      noPropietario: formValue.noPropietario || false
    };

    this._inmueble.guardarBienInmueble(payload, this.declaranteId).subscribe({
      next: (res: any) => {
        this.loadBienesInmuebles();
        this.toastr.success('Bien inmueble guardado correctamente');
        this.closeDialog();
      },
      error: (err) => {
        console.error('Error al guardar bien inmueble:', err);
        this.toastr.error('Error al guardar bien inmueble');
      }
    });
    // }
  }

  eliminarBien(b: BienChile): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el bien inmueble seleccionado.',
      icon: 'warning',
      showCancelButton: true,
    }).then(result => {
      if (result.isConfirmed) {
        this._inmueble.eliminarInmueble(Number(b.id)).subscribe({
          next: () => {
            this.loadBienesInmuebles();
            this.toastr.success('Bien inmueble eliminado correctamente');
          },
          error: (err) => {
            console.error('Error al eliminar bien inmueble:', err);
            this.toastr.error('Error al eliminar bien inmueble');
          }
        });
      }
    });
  }

  onChileChange(value: string): void {
    this.tieneChile = value;
    this._declaracion.guardarRegistro(this.declaranteId, 'bienesInmuebles', value === 'si').subscribe({
      next: (res: any) => {
        this.toastr.success('Registro actualizado correctamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
        this.toastr.error('Error al actualizar registro');
      }
    });
  }

  private buildChileForm(item?: BienChile): void {
    this.bienChileForm = this.fb.group({
      regionId: [item?.regionId || ''],
      comunaId: [item?.comunaId || ''],
      calle: [item?.calle || ''],
      numero: [item?.numero || ''],
      departamento: [item?.departamento || ''],
      numeroInscripcion: [item?.numeroInscripcion || ''],
      fojas: [item?.fojas || ''],
      anio: [item?.anio || ''],
      rolAvaluoUno: [item?.rolAvaluoUno || ''],
      rolAvaluoDos: [item?.rolAvaluoDos || ''],
      conservadorId: [item?.conservadorId || ''],
      avaluoFiscal: [item?.avaluoFiscal || ''],
      porcentaje: [item?.porcentaje || 100],
      fechaAdquisicion: [item?.fechaAdquisicion || ''],
      claseId: [item?.claseId || ''],
      rbDomicilio: [item?.rbDomicilio || false],
      noPropietario: [item?.noPropietario || false]
    });
  }

  openAddExtranjeroModal(): void {
    this.editExtranjero = false;
    this.currentExtranjero = null;
    this.buildExtranjeroForm();
    this.dialogRef = this.dialog.open(this.bienExtranjeroModal, { width: '800px' });
  }

  openEditExtranjeroModal(b: BienExtranjero): void {
    this.editExtranjero = true;
    this.currentExtranjero = b;
    this.buildExtranjeroForm(b);
    this.dialogRef = this.dialog.open(this.bienExtranjeroModal, { width: '800px' });
  }

  saveBienExtranjero(): void {
    if (this.bienExtranjeroForm.valid) {
      const formValue = this.bienExtranjeroForm.value;
      const payload = {
        id: this.editExtranjero ? this.currentExtranjero?.id : null,
        tabId: '1',
        paisId: formValue.paisId || '',
        ciudad: formValue.ciudad || '',
        calle: formValue.calle || '',
        numero: formValue.numero || '',
        departamento: formValue.departamento || '',
        valor: formValue.valor || '',
        tipoMonedaId: formValue.tipoMonedaId || '',
        porcentaje: formValue.porcentaje || 100,
        fechaAdquisicion: formValue.fechaAdquisicion ? formatDate(formValue.fechaAdquisicion, 'dd/MM/yyyy', 'es') : '',
        claseId: formValue.claseId || '',
        extranjero: true,
        borrador: !this.isFormValid(this.bienExtranjeroForm),
        controlador: false,
        noPropietario: formValue.noPropietario || false
      };

      this._inmueble.guardarBienInmueble(payload, this.declaranteId).subscribe({
        next: (res: any) => {
          this.loadBienesInmueblesExtranjero();
          this.toastr.success('Bien inmueble extranjero guardado correctamente');
          this.closeDialog();
        },
        error: (err) => {
          console.error('Error al guardar bien inmueble extranjero:', err);
          this.toastr.error('Error al guardar bien inmueble extranjero');
        }
      });
    }
  }

  eliminarBienExt(b: BienExtranjero): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el bien inmueble extranjero seleccionado.',
      icon: 'warning',
      showCancelButton: true,
    }).then(result => {
      if (result.isConfirmed) {
        this._inmueble.eliminarInmueble(Number(b.id)).subscribe({
          next: () => {
            this.loadBienesInmueblesExtranjero();
            this.toastr.success('Bien inmueble extranjero eliminado correctamente');
          },
          error: (err) => {
            console.error('Error al eliminar bien inmueble extranjero:', err);
            this.toastr.error('Error al eliminar bien inmueble extranjero');
          }
        });
      }
    });
  }

  onExtranjeroChange(value: string): void {
    this.tieneExtranjero = value;
    this._declaracion.guardarRegistro(this.declaranteId, 'bienesInmueblesExtranjero', value === 'si').subscribe({
      next: (res: any) => {
        this.toastr.success('Registro actualizado correctamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
        this.toastr.error('Error al actualizar registro');
      }
    });
  }

  private buildExtranjeroForm(item?: BienExtranjero): void {
    this.bienExtranjeroForm = this.fb.group({
      paisId: [item?.paisId || ''],
      ciudad: [item?.ciudad || ''],
      calle: [item?.calle || ''],
      numero: [item?.numero || ''],
      departamento: [item?.departamento || ''],
      valor: [item?.valor || ''],
      tipoMonedaId: [item?.tipoMonedaId || ''],
      porcentaje: [item?.porcentaje || 100],
      fechaAdquisicion: [item?.fechaAdquisicion || ''],
      claseId: [item?.claseId || ''],
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
