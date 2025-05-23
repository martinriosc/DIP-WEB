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

import { ComunidadValoresService } from 'src/app/modules/declaraciones/services/comunidad-valores.service';
import { InmuebleService } from 'src/app/modules/declaraciones/services/inmueble.service';
import { LocalidadService } from 'src/app/modules/declaraciones/services/localidad.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';
import { DeclaracionService } from 'src/app/modules/declaraciones/services/declaracion.service';
import { formatDate } from '@angular/common';

export interface DerechoAccion {
  titulo: string;
  tipoCantidadPorcentaje: 'Cantidad' | 'Porcentaje';
  cantidadPorcentaje: number;
  razonSocial: string;
  rut: string;
  giro: string;
  fechaAdquisicion: string;
  tipoValor: 'Valor corriente' | 'Valor libro';
  valor: number;
  gravamenes: string;
  controlador: boolean;
}

@Component({
  selector: 'app-paso-9-derechos-acciones',
  standalone: false,
  templateUrl: './paso-9-derechos-acciones.component.html',
  styleUrls: ['./paso-9-derechos-acciones.component.scss']
})
export class Paso9DerechosAccionesComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild('modalChile') modalChile!: TemplateRef<any>;
  @ViewChild('modalExtranjero') modalExtranjero!: TemplateRef<any>;

  displayedColumnsChile = ['titulo', 'cantidadPorcentaje', 'razonSocial', 'rut', 'giro', 'fechaAdquisicion', 'valor', 'gravamenes', 'controlador', 'estado', 'acciones'];
  displayedColumnsExtranjero = ['titulo', 'cantidadPorcentaje', 'razonSocial', 'fechaAdquisicion', 'valor', 'gravamenes', 'pais', 'controlador', 'estado', 'acciones'];

  derechosAcciones: DerechoAccion[] = [];
  formDerechoAccionChile!: FormGroup;
  formDerechoAccionExtranjero!: FormGroup;
  dialogRef: MatDialogRef<any> | null = null;
  editMode = false;
  currentItem: any

  private activeDeclId!: string;

  tieneDerechosChile = '';
  tieneDerechosExtranjero = '';

  derechosAccionesChile: any[] = [];
  derechosAccionesExtranjero: any[] = [];
  titulos: any[] = [];
  gravamenes: any[] = [];
  paises: any[] = [];

  declaracionId: number = this._declaracionHelper.declaracionId;
  declaranteId: number = this._declaracionHelper.declaranteId;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _comunidad: ComunidadValoresService,
    private _inmueble: InmuebleService,
    private _localidad: LocalidadService,
    private _declaracionHelper: DeclaracionHelperService,
    private _declaracion: DeclaracionService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initFormChile();
    this.initFormExtranjero();
    this._declaracionHelper.activeId$.subscribe(id => this.activeDeclId = id);
    // const path = ['declaraciones', this.activeDeclId, 'paso9'];
    // this._declaracionHelper.markStepIncomplete(path);

    this.loadDerechosOAcciones();
    this.loadTitulos();
    this.loadPaises();
  }


  ngAfterViewInit(): void {
    this.loadRegistro();
  }



  loadRegistro() {
    this._declaracionHelper.declaracionesFlag$.subscribe(data => {
      if(data.sociedades != undefined) {
        this.tieneDerechosChile = data.sociedades ? 'si' : 'no';
      }
      if(data.sociedadesExtranjero != undefined) {
        this.tieneDerechosExtranjero = data.sociedadesExtranjero ? 'si' : 'no';
      }
    })
  }

  loadDerechosOAcciones() {

    this._comunidad.listar(1, this.declaranteId, false).subscribe({
      next: (res: any) => {

        this.derechosAccionesChile = res;
      },
      error: (err) => {
        console.log(err);
      }
    })

    this._comunidad.listar(1, this.declaranteId, true).subscribe({
      next: (res: any) => {

        this.derechosAccionesExtranjero = res;
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

  loadDegravamen(tipoGravamen: string) {
    this._inmueble.listarAtributos('degravamen', tipoGravamen).subscribe({
      next: (res: any) => {

        this.gravamenes = res;
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

  onTieneDerechosChileChange(event: any) {
    this.tieneDerechosChile = event;
    this._declaracion.guardarRegistro(this.declaranteId, 'sociedades', event === 'si').subscribe({
      next: (res: any) => {
        console.log('Registro guardado exitosamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
      }
    });
  }

  onTieneDerechosExtranjeroChange(event: any) {
    this.tieneDerechosExtranjero = event;
    this._declaracion.guardarRegistro(this.declaranteId, 'sociedadesExtranjero', event === 'si').subscribe({
      next: (res: any) => {
        console.log('Registro guardado exitosamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
      }
    });
  }




  /** crea o reinicia el form */
  private initFormChile(item?: any): void {
    this.formDerechoAccionChile = this.fb.group({
      tituloId: [item?.titulo || ''],
      tipoId: [item?.tipoCantidadPorcentaje || 'Cantidad'],
      cantidadPorcentaje: [item?.cantidadPorcentaje || '', [Validators.pattern('^[0-9]+$')]],
      cantidad: [item?.cantidad || '', [Validators.pattern('^[0-9]+$')]],
      razonSocial: [item?.razonSocial || ''],
      rut: [item?.rut || ''],
      giroSii: [item?.giro || ''],
      fechaAdquisicion: [item?.fechaAdquisicion || ''],
      valorPlazaLibro: [item?.tipoValor || 'Valor corriente'],
      valorCorriente: [item?.valor || '', [Validators.pattern('^[0-9]+$')]],
      gravamenId: [item?.gravamenes || ''],
      controlador: [item?.controlador ?? false]
    });
  }

  private initFormExtranjero(item?: any): void {
    this.formDerechoAccionExtranjero = this.fb.group({
      titulo: [item?.titulo || ''],
      tipoId: [item?.tipoCantidadPorcentaje || 'Cantidad'],
      cantidadPorcentaje: [item?.cantidadPorcentaje || '', [Validators.pattern('^[0-9]+$')]],
      cantidad: [item?.cantidad || '', [Validators.pattern('^[0-9]+$')]],
      razonSocial: [item?.razonSocial || ''],
      fechaAdquisicion: [item?.fechaAdquisicion || ''],
      valorCorriente: [item?.tipoValor || 'Valor corriente'],
      gravamenId: [item?.gravamenes || ''],
      paisId: [item?.paisId || ''],

      controlador: [item?.controlador ?? false]
    });
  }

  /** Abre modal para agregar nuevo derecho/acción en Chile */
  openAddModalChile(): void {
    this.editMode = false;
    this.currentItem = null;
    this.initFormChile();
    this.dialogRef = this.dialog.open(this.modalChile, {
      width: '800px',
      disableClose: true
    });
  }

  /** Abre modal para editar derecho/acción en Chile */
  openEditModalChile(item: DerechoAccion): void {
    this.editMode = true;
    this.currentItem = item;
    this.initFormChile(item);
    this.dialogRef = this.dialog.open(this.modalChile, {
      width: '800px',
      disableClose: true
    });
  }

  /** Abre modal para agregar nuevo derecho/acción en el extranjero */
  openAddModalExtranjero(): void {
    this.editMode = false;
    this.currentItem = null;
    this.initFormExtranjero();
    this.dialogRef = this.dialog.open(this.modalExtranjero, {
      width: '800px',
      disableClose: true
    });
  }

  /** Abre modal para editar derecho/acción en el extranjero */
  openEditModalExtranjero(item: DerechoAccion): void {
    this.editMode = true;
    this.currentItem = item;
    this.initFormExtranjero(item);
    this.dialogRef = this.dialog.open(this.modalExtranjero, {
      width: '800px',
      disableClose: true
    });
  }

  /** Cierra el modal actual */
  closeDialog(): void {
    this.dialogRef?.close();
  }

  /** Guarda el derecho/acción y cierra el modal */
  saveDialogChile(): void {
    const fv = this.formDerechoAccionChile.value;
    const payload = {
      id: this.editMode ? this.currentItem?.id : null,
      tipoId: 1,                                 // constante = “derechos/acciones”
      tituloId: fv.tituloId || '',
      cantidadPorcentaje: fv.tipoId === 'Porcentaje',
      cantidad: fv.cantidadPorcentaje || '',
      razonSocial: fv.razonSocial || '',
      rut: fv.rut || '',
      giroSii: fv.giroSii || '',
      fechaAdquisicion: fv.fechaAdquisicion
        ? formatDate(fv.fechaAdquisicion, 'dd/MM/yyyy', 'es')
        : '',
      valorPlazaLibro: fv.valorPlazaLibro === 'Valor libro',
      valorCorriente: fv.valorCorriente || '',
      gravamenId: fv.gravamenId || '',
      calidadControlador: fv.controlador || false,
      borrador: !this.isFormValid(this.formDerechoAccionChile),
      extranjero: false,
      controlador: false
    };

    this._comunidad.guardar(payload, this.declaranteId).subscribe({
      next: () => {    // refrescamos tabla
        this.loadDerechosOAcciones();
        this.toastr.success('Guardado correctamente');
        this.closeDialog();
      },
      error: () => this.toastr.error('No se pudo guardar')
    });
  }

  saveDialogExtranjero(): void {
   const fv = this.formDerechoAccionExtranjero.value;
const payload = {
  id: this.editMode ? this.currentItem?.id : null,
  tipoId: 1,                                 // constante = “derechos/acciones”
  tituloId: fv.tituloId || '',
  cantidadPorcentaje: fv.tipoId === 'Porcentaje',
  cantidad: fv.cantidadPorcentaje || '',
  razonSocial: fv.razonSocial || '',
  rut: fv.rut || '',
  giroSii: fv.giroSii || '',
  paisId: fv.paisId || '',
  fechaAdquisicion: fv.fechaAdquisicion
      ? formatDate(fv.fechaAdquisicion, 'dd/MM/yyyy', 'es')
      : '',
  valorPlazaLibro: fv.valorPlazaLibro === 'Valor libro',
  valorCorriente: fv.valorCorriente || '',
  gravamenId: fv.gravamenId || '',
  calidadControlador: fv.controlador || false,
  borrador: !this.isFormValid(this.formDerechoAccionExtranjero),
  extranjero: true,
  controlador: false
};

this._comunidad.guardar(payload, this.declaranteId).subscribe({
  next: () => {    // refrescamos tabla
    this.loadDerechosOAcciones();
    this.toastr.success('Guardado correctamente');
    this.closeDialog();
  },
  error: () => this.toastr.error('No se pudo guardar')
});
  }

  /** elimina un ítem */
  deleteItem(index: any, tipo:number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el derecho o acción seleccionado.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if(tipo == 1) {
          this._comunidad.eliminar(index.id).subscribe({
            next: () => {
              this.loadDerechosOAcciones();
              this.toastr.success('Eliminado correctamente');
            },
            error: () => this.toastr.error('No se pudo eliminar')
          });
        } else if(tipo == 2) {
          this._comunidad.eliminar(index.id).subscribe({
            next: () => {
              this.loadDerechosOAcciones();
              this.toastr.success('Eliminado correctamente');
            },
            error: () => this.toastr.error('No se pudo eliminar')
          });
        }

      }
    });
  }

  /** guarda y avanza al siguiente paso */
  onSubmit(): void {
    const ok1 = this.tieneDerechosChile === 'si' ? this.derechosAccionesChile.length > 0 : true;
    const ok2 = this.tieneDerechosExtranjero === 'si' ? this.derechosAccionesExtranjero.length > 0 : true;
    const ok = ok1 && ok2;

    if (ok) {
      this._declaracionHelper.markStepCompleted(['declaraciones', 'paso9']);
      this._declaracionHelper.nextStep();
    } else {
      this._declaracionHelper.markStepIncomplete(['declaraciones', 'paso9']);
      this._declaracionHelper.nextStep();
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
