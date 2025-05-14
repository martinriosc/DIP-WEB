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

import { AguasService } from 'src/app/modules/declaraciones/services/aguas.service';
import { LocalidadService } from 'src/app/modules/declaraciones/services/localidad.service';
import { ComunService } from 'src/app/modules/declaraciones/services/comun.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';
import { DeclaracionService } from 'src/app/modules/declaraciones/services/declaracion.service';

interface DerechoAgua {
  id?: string;
  tabId: string;
  numeroResolucion: string;
  anio: string;
  entidadEmisoraId: number;
  tipoDerechoId: number;
  naturalezaAguaId: number;
  nombreAlveo: string;
  rolExpediente: string;
  regionId: number;
  estado: string;
  borrador: boolean;
  controlador: boolean;
  noPropietario: boolean;
}

interface Concesion {
  id?: string;
  tabId: string;
  actoOtorgaId: number;
  numero: string;
  anio: string;
  servicioEmisorId: number;
  tipoId: number;
  numeroResolucion: string;
  estado: string;
  borrador: boolean;
  controlador: boolean;
  noPropietario: boolean;
}

@Component({
  selector: 'app-paso-7-derechos-aguas',
  templateUrl: './paso-7-derechos-aguas.component.html',
  standalone: false,
  styleUrls: ['./paso-7-derechos-aguas.component.scss']
})
export class Paso7DerechosAguasComponent implements OnInit, AfterViewInit {
  tieneDerechosAguas = 'no';
  tieneConcesiones = 'no';

  derechosAguasData: any[] = [];
  displayedColumnsDerechos = [
    'numeroResolucion', 'anio', 'entidad', 'tipoDerecho',
    'naturaleza', 'nombreCauce', 'rolExpediente', 'region', 'estado', 'acciones'
  ];

  concesionesData: any[] = [];
  displayedColumnsConcesiones = [
    'actoOtorga', 'numero', 'anio', 'emisor', 'tipo',
    'numeroRegistro', 'anioRegistro', 'estado', 'acciones'
  ];

  @ViewChild('derechosAguasModal') derechosAguasModal!: TemplateRef<any>;
  derechosAguasForm!: FormGroup;
  editDerecho = false;
  currentDerecho: DerechoAgua | null = null;

  @ViewChild('concesionModal') concesionModal!: TemplateRef<any>;
  concesionForm!: FormGroup;
  editConcesion = false;
  currentConcesion: Concesion | null = null;

  entidadesEmisoras: any[] = [];
  tiposDerecho: any[] = [];
  naturalezaAgua: any[] = [];
  regiones: any[] = [];
  actos: any[] = [];
  serviciosEmisores: any[] = [];
  tipos: any[] = [];

  declaracionId: number = this._declaracionHelper.declaracionId;
  declaranteId: number = this._declaracionHelper.declaranteId;

  private dialogRef: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _aguas: AguasService,
    private _localidad: LocalidadService,
    private _comun: ComunService,
    private _declaracionHelper: DeclaracionHelperService,
    private _declaracion: DeclaracionService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.buildDerechoForm();
    this.buildConcesionForm();
    this.loadAguas();
    this.loadEntidadesEmisoras();
    this.loadTiposDerecho();
    this.loadNaturalezaAgua();
    this.loadRegiones();
    this.loadActos();
    this.loadServiciosEmisores();
    this.loadTipos();
  }

  ngAfterViewInit(): void {
    this.loadRegistro();
  }

  loadRegistro() {
    this._declaracionHelper.declaracionesFlag$.subscribe(data => {
      this.tieneDerechosAguas = data.aguas ? 'si' : 'no';
      this.tieneConcesiones = data.concesiones ? 'si' : 'no';
    });
  }

  loadAguas() {
    this._aguas.listar('aprovechamiento', this.declaranteId).subscribe({
      next: (response: any) => {
        console.log(response)
        this.derechosAguasData = response;
      },
      error: (err) => {
        console.error('Error al cargar derechos de agua:', err);
        this.toastr.error('Error al cargar derechos de agua');
      }
    });

    this._aguas.listar('concesiones', this.declaranteId).subscribe({
      next: (response: any) => {
        this.concesionesData = response;
      },
      error: (err) => {
        console.error('Error al cargar concesiones:', err);
        this.toastr.error('Error al cargar concesiones');
      }
    });
  }

  loadEntidadesEmisoras() {
    this._aguas.listarEntidadesLike('').subscribe({
      next: (response: any) => {
        this.entidadesEmisoras = response;
      },
      error: (err) => {
        console.error('Error al cargar entidades emisoras:', err);
        this.toastr.error('Error al cargar entidades emisoras');
      }
    });
  }

  loadTiposDerecho() {
    this._aguas.listarAtributos('tipoDerecho').subscribe({
      next: (response: any) => {
        this.tiposDerecho = response;
      },
      error: (err) => {
        console.error('Error al cargar tipos de derecho:', err);
        this.toastr.error('Error al cargar tipos de derecho');
      }
    });
  }

  loadNaturalezaAgua() {
    this._aguas.listarNaturaleza().subscribe({
      next: (response: any) => {
        this.naturalezaAgua = response;
      },
      error: (err) => {
        console.error('Error al cargar naturaleza del agua:', err);
        this.toastr.error('Error al cargar naturaleza del agua');
      }
    });
  }

  loadRegiones() {
    this._localidad.getRegiones().subscribe({
      next: (response: any) => {
        this.regiones = response;
      },
      error: (err) => {
        console.error('Error al cargar regiones:', err);
        this.toastr.error('Error al cargar regiones');
      }
    });
  }

  loadActos() {
    this._aguas.listarAtributos('actoAdministrativo').subscribe({
      next: (response: any) => {
        this.actos = response;
      },
      error: (err) => {
        console.error('Error al cargar actos administrativos:', err);
        this.toastr.error('Error al cargar actos administrativos');
      }
    });
  }

  loadServiciosEmisores() {
    this._comun.listarEntity('', 'ServicioEmisor').subscribe({
      next: (response: any) => {
        this.serviciosEmisores = response;
      },
      error: (err) => {
        console.error('Error al cargar servicios emisores:', err);
        this.toastr.error('Error al cargar servicios emisores');
      }
    });
  }

  loadTipos() {
    this._comun.listarEntity('', 'TipoConcesion').subscribe({
      next: (response: any) => {
        this.tipos = response;
      },
      error: (err) => {
        console.error('Error al cargar tipos de concesión:', err);
        this.toastr.error('Error al cargar tipos de concesión');
      }
    });
  }

  onSubmit(): void {
    const ok1 = this.tieneDerechosAguas === 'si' ? this.derechosAguasData.length > 0 : true;
    const ok2 = this.tieneConcesiones === 'si' ? this.concesionesData.length > 0 : true;
    const ok = ok1 && ok2;

    if (ok) {
      this._declaracionHelper.markStepCompleted(['declaraciones', 'paso7']);
      this._declaracionHelper.nextStep();
    } else {
      this._declaracionHelper.markStepIncomplete(['declaraciones', 'paso7']);
      this._declaracionHelper.nextStep();
    }
  }

  openAddDerechoModal(): void {
    this.editDerecho = false;
    this.currentDerecho = null;
    this.buildDerechoForm();
    this.dialogRef = this.dialog.open(this.derechosAguasModal, { width: '800px' });
  }

  openEditDerechoModal(item: DerechoAgua): void {
    this.editDerecho = true;
    this.currentDerecho = item;
    this.buildDerechoForm(item);
    this.dialogRef = this.dialog.open(this.derechosAguasModal, { width: '800px' });
  }

  openAddConcesionModal(): void {
    this.editConcesion = false;
    this.currentConcesion = null;
    this.buildConcesionForm();
    this.dialogRef = this.dialog.open(this.concesionModal, { width: '800px' });
  }

  openEditConcesionModal(item: Concesion): void {
    this.editConcesion = true;
    this.currentConcesion = item;
    this.buildConcesionForm(item);
    this.dialogRef = this.dialog.open(this.concesionModal, { width: '800px' });
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  saveDerecho(): void {
    if (this.derechosAguasForm.valid) {
      const f = this.derechosAguasForm.value;
      const payload = {
        id: this.editDerecho ? this.currentDerecho?.id : null,
        numeroResolucion: f.numeroResolucion || '',
        anio: f.anio || '',
        entidadId: f.entidadId || '',
        tipoDerechoId: f.tipoDerechoId || '',
        naturalezaId: f.naturalezaId || '',
        nombreCauce: f.nombreCauce || '',
        rolExpediente: f.rolExpediente || '',
        regionId: f.regionId || '',
        borrador: !this.isFormValid(this.derechosAguasForm),
        controlador: false
      };

      this._aguas.guardarDerecho(payload, this.declaranteId).subscribe({
        next: (res: any) => {
          this.loadAguas();
          this.toastr.success('Derecho de agua guardado correctamente');
          this.closeDialog();
        },
        error: (err) => {
          console.error('Error al guardar derecho de agua:', err);
          this.toastr.error('Error al guardar derecho de agua');
        }
      });
    }
  }

  saveConcesion(): void {
    if (this.concesionForm.valid) {
      const f = this.concesionForm.value;
      const payload = {
        id: this.editConcesion ? this.currentConcesion?.id : null,
        actoOtorgaId: f.actoOtorgaId || '',
        numero: f.numero || '',
        anio: f.anio || '',
        emisorId: f.emisorId || '',
        tipoId: f.tipoId || '',
        numeroRegistro: f.numeroRegistro || '',
        anioRegistro: f.anioRegistro || '',
        borrador: !this.isFormValid(this.concesionForm),
        controlador: false
      };

      this._aguas.guardarConcesion(payload, this.declaranteId).subscribe({
        next: (res: any) => {
          this.loadAguas();
          this.toastr.success('Concesión guardada correctamente');
          this.closeDialog();
        },
        error: (err) => {
          console.error('Error al guardar concesión:', err);
          this.toastr.error('Error al guardar concesión');
        }
      });
    }
  }

  eliminarDerecho(item: DerechoAgua): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el derecho de agua seleccionado.',
      icon: 'warning',
      showCancelButton: true,
    }).then(result => {
      if (result.isConfirmed) {
        this._aguas.eliminar('aprovechamiento',Number(item.id)).subscribe({
          next: () => {
            this.loadAguas();
            this.toastr.success('Derecho de agua eliminado correctamente');
          },
          error: (err) => {
            console.error('Error al eliminar derecho de agua:', err);
            this.toastr.error('Error al eliminar derecho de agua');
          }
        });
      }
    });
  }

  eliminarConcesion(item: Concesion): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la concesión seleccionada.',
      icon: 'warning',
      showCancelButton: true,
    }).then(result => {
      if (result.isConfirmed) {
        this._aguas.eliminar('concesiones',(Number(item.id))).subscribe({
          next: () => {
            this.loadAguas();
            this.toastr.success('Concesión eliminada correctamente');
          },
          error: (err) => {
            console.error('Error al eliminar concesión:', err);
            this.toastr.error('Error al eliminar concesión');
          }
        });
      }
    });
  }

  onTieneDerechosChange(value: string): void {
    this.tieneDerechosAguas = value;
    this._declaracion.guardarRegistro(this.declaranteId, 'aguas', value === 'si').subscribe({
      next: (res: any) => {
        this.toastr.success('Registro actualizado correctamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
        this.toastr.error('Error al actualizar registro');
      }
    });
  }

  onTieneConcesionesChange(value: string): void {
    this.tieneConcesiones = value;
    this._declaracion.guardarRegistro(this.declaranteId, 'concesiones', value === 'si').subscribe({
      next: (res: any) => {
        this.toastr.success('Registro actualizado correctamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
        this.toastr.error('Error al actualizar registro');
      }
    });
  }

  private buildDerechoForm(item?: any): void {
    this.derechosAguasForm = this.fb.group({
      numeroResolucion: [item?.numeroResolucion || ''],
      anio: [item?.anio || ''],
      entidadId: [item?.entidadId || ''],
      tipoDerechoId: [item?.tipoDerechoId || ''],
      naturalezaId: [item?.naturalezaId || ''],
      nombreCauce: [item?.nombreCauce || ''],
      rolExpediente: [item?.rolExpediente || ''],
      regionId: [item?.regionId || '']
    });
  }

  private buildConcesionForm(item?: any): void {
    this.concesionForm = this.fb.group({
      actoOtorgaId: [item?.actoOtorgaId || ''],
      numero: [item?.numero || ''],
      anio: [item?.anio || ''],
      emisorId: [item?.emisorId || ''],
      tipoId: [item?.tipoId || ''],
      numeroRegistro: [item?.numeroRegistro || ''],
      anioRegistro: [item?.anioRegistro || '']
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
