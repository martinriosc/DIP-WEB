import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnInit
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import {
  ActividadProfesionalService
} from 'src/app/modules/declaraciones/services/actividad-profesional.service';
import { ComunService } from 'src/app/modules/declaraciones/services/comun.service';
import { DeclaracionHelperService }
  from 'src/app/modules/declaraciones/services/declaracion-helper.service';
import { DeclaracionService }
  from 'src/app/modules/declaraciones/services/declaracion.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-paso-5-actividades',
  standalone: false,
  templateUrl: './paso-5-actividades.component.html',
  styleUrls: ['./paso-5-actividades.component.scss']
})
export class Paso5ActividadesComponent implements OnInit, AfterViewInit {

  /* ---------------- Estados globales ---------------- */
  actividadesUltimos12Meses = '';
  actividadesQueRealiza = '';
  actividadesConyuge = '';
  flagConyuge = false;
  private dialogRef: any;

  /* ---------------- Tablas & columnas ---------------- */
  displayedColumnActividad12Meses = ['tipoActividad', 'rubroArea', 'vinculo', 'objetoEntidad', 'dataSensible', 'estado', 'acciones'];
  displayedColumnsActividadesRealiza = ['tipoActividad', 'rubroArea', 'vinculo', 'objetoVinculo', 'fechaInicio', 'beneficiario', 'dataSensible', 'estado', 'acciones'];
  displayedColumnsActividadesConyuge = ['tipoActividad', 'rubroArea', 'fechaInicio', 'clasificacion', 'beneficiario', 'rutBeneficiario', 'dataSensible', 'estado', 'acciones'];

  actividades12Meses: any[] = [];
  actividadesRealiza: any[] = [];
  actividadesConyugeData: any[] = [];

  /* ---------------- Formularios ---------------- */
  @ViewChild('actividad12MesesModal') actividad12MesesModal!: TemplateRef<any>;
  @ViewChild('actividadesRealizaModal') actividadesRealizaModal!: TemplateRef<any>;
  @ViewChild('actividadesConyugeModal') actividadesConyugeModal!: TemplateRef<any>;

  actividades12MesesForm!: FormGroup;
  actividadesRealizaForm!: FormGroup;
  actividadesConyugeForm!: FormGroup;

  /* ---------------- Flags de edición ---------------- */
  edit12MesesMode = false;
  editRealizaMode = false;
  editConyugeMode = false;

  current12MesesItem: any = null;
  currentRealizaItem: any = null;
  currentConyugeItem: any = null;

  /* ---------------- Catálogos ---------------- */
  tiposActividades: any[] = [];
  actividadesProfesionales: any[] = [];
  clasificaciones: any[] = [];

  /* ---------------- IDs ---------------- */
  declaracionId = 0;
  declaranteId = 0;
  private activeDeclId!: string;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private helper: DeclaracionHelperService,
    private actividadSrv: ActividadProfesionalService,
    private comunSrv: ComunService,
    private declaracionSrv: DeclaracionService,
    private toastr: ToastrService,
    private _spinner: NgxSpinnerService
  ) { }

  /* ===================================================================
     CICLO DE VIDA
  =================================================================== */
  ngOnInit(): void {
    this._spinner.show();
    this.buildAllForms();
    this.helper.activeId$.subscribe(id => (this.activeDeclId = id));
    this.declaracionId = this.helper.declaracionId
    this.declaranteId = this.helper.declaranteId
    this.declaracionId = this.helper.declaracionId
    this.declaranteId = this.helper.declaranteId

    this.loadCatalogos();
    this.validarConyuge();
    this.loadActividades();
  }



  ngAfterViewInit(): void {
    this.helper.declaracionesFlag$.subscribe(flag => {
      console.log(flag.actividadesIndividuales)
      if(flag.actividadesIndividuales != undefined) {
        this.actividadesUltimos12Meses = flag.actividadesIndividuales ? 'si' : 'no';
      }
      if(flag.actividadesDependientes != undefined) {
        this.actividadesQueRealiza = flag.actividadesDependientes ? 'si' : 'no';
      }
      if(flag.actividadesGremiales != undefined) {
        this.actividadesConyuge = flag.actividadesGremiales ? 'si' : 'no';
      }
      console.log(flag.actividadesIndividuales)
      if(flag.actividadesIndividuales != undefined) {
        this.actividadesUltimos12Meses = flag.actividadesIndividuales ? 'si' : 'no';
      }
      if(flag.actividadesDependientes != undefined) {
        this.actividadesQueRealiza = flag.actividadesDependientes ? 'si' : 'no';
      }
      if(flag.actividadesGremiales != undefined) {
        this.actividadesConyuge = flag.actividadesGremiales ? 'si' : 'no';
      }
    });
  }

  /* ===================================================================
     UI – Construcción de formularios
  =================================================================== */
  private buildAllForms() {
    /* grupo 1 */
    this.actividades12MesesForm = this.fb.group({
      tipoActividadId: [''],
      rubroId: [''],
      descripcionActividad: [''],
      rbDatoSensible: ['']
    });

    /* grupo 2 */
    this.actividadesRealizaForm = this.fb.group({
      tipoActividadId: [''],
      rubroId: [''],
      fechaInicio: [''],
      clasificacionId: [''],
      beneficiario: [''],
      rbRunRut: ['rut'],
      rut: [''],
      rbDatoSensible: ['']
    });

    /* grupo 3 */
    this.actividadesConyugeForm = this.fb.group({
      tipoActividadId: [''],
      rubroId: [''],
      fechaInicio: [''],
      clasificacionId: [''],
      beneficiario: [''],
      rbRunRut: ['rut'],
      rut: [''],
      rbDatoSensible: ['']
    });
  }

  /* ===================================================================
     CARGA DE CATÁLOGOS
  =================================================================== */
  private loadCatalogos() {
    this.comunSrv.listarEntity('', 'TipoActividad').subscribe({
      next: (res: any) => (this.tiposActividades = res),
      error: console.error
    });

    this.actividadSrv.listar('', 'tipo').subscribe({
      next: res => (this.actividadesProfesionales = res),
      error: console.error
    });

    this.actividadSrv.listar('', 'clasificacion').subscribe({
      next: res => (this.clasificaciones = res),
      error: console.error
    });
  }

  /* ===================================================================
     CONYUGE
  =================================================================== */
  private validarConyuge() {
    this.actividadSrv.validarConyuge(this.declaracionId).subscribe({
      next: flag => (this.flagConyuge = flag),
      error: console.error
    });
  }

  /* ===================================================================
     CRUD — Lectura
  =================================================================== */
  private loadActividades() {
    this.actividadSrv.listarActividades(1, this.declaranteId).subscribe({
      next: res => (this.actividades12Meses = res || []),
      error: console.error
    });

    this.actividadSrv.listarActividades(2, this.declaranteId).subscribe({
      next: res => (this.actividadesRealiza = res || []),
      error: console.error
    });

    this.actividadSrv.listarActividades(3, this.declaranteId).subscribe({
      next: res => (this.actividadesConyugeData = res || []),
      error: console.error
    });

    this._spinner.hide();
  }

  /* ===================================================================
     CRUD — Creación / Edición
  =================================================================== */
  /* ---------- helpers ---------- */
  private buildPayload(tipo: '12meses' | 'realiza' | 'conyuge', form: FormGroup, id = '') {

    let formulario: any = form.value

    switch (tipo) {

      /* grupo 1: Actividades últimos 12 meses */
      case '12meses':
        return {
          id,
          grupo: '1',
          tipoActividadId: formulario.tipoActividadId,
          rubroId: formulario.rubroId,
          descripcionActividad: formulario.descripcionActividad,
          rbDatoSensible: formulario.rbDatoSensible,
          borrador: !this.isFormValid(form)
        };

      /* grupo 2: Actividades realiza a la fecha */
      case 'realiza':
        return {
          id,
          grupo: '2',
          tipoActividadId: formulario.tipoActividadId,
          rubroId: formulario.rubroId,
          fechaInicio: formatDate(formulario.fechaInicio, 'dd/MM/yyyy', 'es'),
          clasificacionId: formulario.clasificacionId,
          razonSocial: formulario.beneficiario,
          rbRunRut: formulario.rutOrun === 'rut',
          rut: formulario.rut,
          rbDatoSensible: formulario.rbDatoSensible,
          borrador: !this.isFormValid(form)
        };

      /* grupo 3: Actividades cónyuge */
      default:
        return {
          id,
          grupo: '3',
          tipoActividadId: formulario.tipoActividadId,
          rubroId: formulario.rubroId,
          fechaInicio: formatDate(formulario.fechaInicio, 'dd/MM/yyyy', 'es'),
          clasificacionId: formulario.clasificacionId,
          razonSocial: formulario.beneficiario,
          rut: formulario.rut,
          rbDatoSensible: formulario.rbDatoSensible,
          borrador: !this.isFormValid(form)
        };
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


  /* ---------- alta / edición ---------- */
  saveActividad(tipo: '12meses' | 'realiza' | 'conyuge') {
    const form =
      tipo === '12meses' ? this.actividades12MesesForm :
        tipo === 'realiza' ? this.actividadesRealizaForm :
          this.actividadesConyugeForm;


    /* id = '' cuando es alta */
    const id =
      tipo === '12meses' && this.edit12MesesMode ? this.current12MesesItem?.id :
        tipo === 'realiza' && this.editRealizaMode ? this.currentRealizaItem?.id :
          tipo === 'conyuge' && this.editConyugeMode ? this.currentConyugeItem?.id :
            '';

    const payload = this.buildPayload(tipo, form, id);

    console.log(payload);

    this.actividadSrv.guardarActividad(payload, this.declaranteId).subscribe({
      next: saved => {
        this.loadActividades();
        this.toastr.success('Actividad guardada correctamente');
        switch (tipo) {
          case '12meses':
            if (this.edit12MesesMode) {
              const idx = this.actividades12Meses.findIndex(a => a.id === saved.id);
              if (idx > -1) this.actividades12Meses[idx] = saved;
            } else {
              this.actividades12Meses.push(saved);
            }
            break;

          case 'realiza':
            if (this.editRealizaMode) {
              const idx = this.actividadesRealiza.findIndex(a => a.id === saved.id);
              if (idx > -1) this.actividadesRealiza[idx] = saved;
            } else {
              this.actividadesRealiza.push(saved);
            }
            break;

          case 'conyuge':
            if (this.editConyugeMode) {
              const idx = this.actividadesConyugeData.findIndex(a => a.id === saved.id);
              if (idx > -1) this.actividadesConyugeData[idx] = saved;
            } else {
              this.actividadesConyugeData.push(saved);
            }
            break;
        }

        this.closeDialog();
        // this.helper.markStepCompleted(['declaraciones', this.activeDeclId, 'paso5']);
      },
      error: err => console.error('Error al guardar:', err)
    });
  }

  /* ---------- eliminación ---------- */
  eliminarActividad(item: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la actividad seleccionada.',
      icon: 'warning',
      showCancelButton: true,
    }).then(result => {
      if (result.isConfirmed) {
        this.actividadSrv.eliminarActividad(item.id).subscribe({
          next: () => {
            this.actividades12Meses = this.actividades12Meses.filter(a => a.id !== item.id);
            this.actividadesRealiza = this.actividadesRealiza.filter(a => a.id !== item.id);
            this.actividadesConyugeData = this.actividadesConyugeData.filter(a => a.id !== item.id);
            this.toastr.success('Actividad eliminada correctamente');
          },
          error: err => console.error('Error al eliminar:', err)
        });
      }
    });


    // if (!confirm(`¿Eliminar la actividad seleccionada?`)) { return; }

    // this.actividadSrv.eliminarActividad(item.id).subscribe({
    //   next: () => {
    //     this.actividades12Meses = this.actividades12Meses.filter(a => a.id !== item.id);
    //     this.actividadesRealiza = this.actividadesRealiza.filter(a => a.id !== item.id);
    //     this.actividadesConyugeData = this.actividadesConyugeData.filter(a => a.id !== item.id);
    //   },
    //   error: err => console.error('Error al eliminar:', err)
    // });
  }

  /* ===================================================================
     DIALOG – Apertura
  =================================================================== */
  openAddModal(tipo: '12meses' | 'realiza' | 'conyuge') {
    /* reset flags & form */
    switch (tipo) {
      case '12meses':
        this.edit12MesesMode = false; this.current12MesesItem = null;
        this.actividades12MesesForm.reset({ datoSensible: 'No' });
        this.dialogRef = this.dialog.open(this.actividad12MesesModal, { width: '800px' });
        break;

      case 'realiza':
        this.editRealizaMode = false; this.currentRealizaItem = null;
        this.actividadesRealizaForm.reset({ datoSensible: 'No', rutOrun: 'rut' });
        this.dialogRef = this.dialog.open(this.actividadesRealizaModal, { width: '800px' });
        break;

      case 'conyuge':
        this.editConyugeMode = false; this.currentConyugeItem = null;
        this.actividadesConyugeForm.reset({ datoSensible: 'No', rutOrun: 'rut' });
        this.dialogRef = this.dialog.open(this.actividadesConyugeModal, { width: '800px' });
        break;
    }
  }

  openEditModal(tipo: '12meses' | 'realiza' | 'conyuge', item: any) {
    switch (tipo) {
      case '12meses':
        this.edit12MesesMode = true;
        this.current12MesesItem = item;
        this.actividades12MesesForm.patchValue({
          ...item,
          datoSensible: item.rbDatoSensible ? 'Si' : 'No'
        });
        this.dialogRef = this.dialog.open(this.actividad12MesesModal, { width: '800px' });
        break;

      case 'realiza':
        this.editRealizaMode = true;
        this.currentRealizaItem = item;
        this.actividadesRealizaForm.patchValue({
          ...item,
          fechaInicio: item.fechaInicio ? new Date(item.fechaInicio) : '',
          datoSensible: item.rbDatoSensible ? 'Si' : 'No',
          rutOrun: item.rbRunRut ? 'rut' : 'run',
          rutBeneficiario: item.rut
        });
        this.dialogRef = this.dialog.open(this.actividadesRealizaModal, { width: '800px' });
        break;

      case 'conyuge':
        this.editConyugeMode = true;
        this.currentConyugeItem = item;
        this.actividadesConyugeForm.patchValue({
          ...item,
          fechaInicio: item.fechaInicio ? new Date(item.fechaInicio) : '',
          datoSensible: item.rbDatoSensible ? 'Si' : 'No',
          rutBeneficiario: item.rut
        });
        this.dialogRef = this.dialog.open(this.actividadesConyugeModal, { width: '800px' });
        break;
    }
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  /* ===================================================================
     RADIO – Tiene/No tiene
  =================================================================== */
  onTieneActividad12MesesChange(value: string): void {
    if (value === 'no' && this.actividades12Meses.length > 0) {
      Swal.fire({
        title: 'No se puede cambiar',
        text: 'Debe eliminar todos los registros antes de cambiar a "No Tiene"',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      this.actividadesUltimos12Meses = 'si';
      return;
    }
    this.actividadesUltimos12Meses = value;
    const path = ['declaraciones', this.activeDeclId, 'paso5'];
    this.declaracionSrv.guardarRegistro(this.declaranteId, 'actividadesIndividuales', value === 'si').subscribe({
      next: (res: any) => {
        console.log('Registro guardado exitosamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
        this.toastr.error('Error al guardar registro');
      }
    });
  }
  onTieneActividad12MesesChange(value: string): void {
    if (value === 'no' && this.actividades12Meses.length > 0) {
      Swal.fire({
        title: 'No se puede cambiar',
        text: 'Debe eliminar todos los registros antes de cambiar a "No Tiene"',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      this.actividadesUltimos12Meses = 'si';
      return;
    }
    this.actividadesUltimos12Meses = value;
    const path = ['declaraciones', this.activeDeclId, 'paso5'];
    this.declaracionSrv.guardarRegistro(this.declaranteId, 'actividadesIndividuales', value === 'si').subscribe({
      next: (res: any) => {
        console.log('Registro guardado exitosamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
        this.toastr.error('Error al guardar registro');
      }
    });
  }

  onTieneActividadRealizaChange(value: string): void {
    if (value === 'no' && this.actividadesRealiza.length > 0) {
      Swal.fire({
        title: 'No se puede cambiar',
        text: 'Debe eliminar todos los registros antes de cambiar a "No Tiene"',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      this.actividadesQueRealiza = 'si';
      return;
    }
    this.actividadesQueRealiza = value;
    const path = ['declaraciones', this.activeDeclId, 'paso5'];
    this.declaracionSrv.guardarRegistro(this.declaranteId, 'actividadesDependientes', value === 'si').subscribe({
      next: (res: any) => {
        console.log('Registro guardado exitosamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
        this.toastr.error('Error al guardar registro');
      }
    });
  }
  onTieneActividadRealizaChange(value: string): void {
    if (value === 'no' && this.actividadesRealiza.length > 0) {
      Swal.fire({
        title: 'No se puede cambiar',
        text: 'Debe eliminar todos los registros antes de cambiar a "No Tiene"',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      this.actividadesQueRealiza = 'si';
      return;
    }
    this.actividadesQueRealiza = value;
    const path = ['declaraciones', this.activeDeclId, 'paso5'];
    this.declaracionSrv.guardarRegistro(this.declaranteId, 'actividadesDependientes', value === 'si').subscribe({
      next: (res: any) => {
        console.log('Registro guardado exitosamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
        this.toastr.error('Error al guardar registro');
      }
    });
  }

  onTieneActividadConyugeChange(value: string): void {
    if (value === 'no' && this.actividadesConyugeData.length > 0) {
      Swal.fire({
        title: 'No se puede cambiar',
        text: 'Debe eliminar todos los registros antes de cambiar a "No Tiene"',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      this.actividadesConyuge = 'si';
      return;
    }
    this.actividadesConyuge = value;
    const path = ['declaraciones', this.activeDeclId, 'paso5'];
    this.declaracionSrv.guardarRegistro(this.declaranteId, 'actividadesGremiales', value === 'si').subscribe({
      next: (res: any) => {
        console.log('Registro guardado exitosamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
        this.toastr.error('Error al guardar registro');
      }
    });
  onTieneActividadConyugeChange(value: string): void {
    if (value === 'no' && this.actividadesConyugeData.length > 0) {
      Swal.fire({
        title: 'No se puede cambiar',
        text: 'Debe eliminar todos los registros antes de cambiar a "No Tiene"',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      this.actividadesConyuge = 'si';
      return;
    }
    this.actividadesConyuge = value;
    const path = ['declaraciones', this.activeDeclId, 'paso5'];
    this.declaracionSrv.guardarRegistro(this.declaranteId, 'actividadesGremiales', value === 'si').subscribe({
      next: (res: any) => {
        console.log('Registro guardado exitosamente');
      },
      error: (err: any) => {
        console.error('Error al guardar registro:', err);
        this.toastr.error('Error al guardar registro');
      }
    });
  }

  /* ===================================================================
     SUBMIT — paso terminado
  =================================================================== */
  onSubmit() {
    const listo =
      ((this.actividadesUltimos12Meses === 'no' || this.actividadesUltimos12Meses == undefined) || this.actividades12Meses.length) &&
      ((this.actividadesQueRealiza === 'no' || this.actividadesQueRealiza == undefined) || this.actividadesRealiza.length) &&
      ((this.actividadesConyuge === 'no' || this.actividadesConyuge == undefined) || this.actividadesConyugeData.length);
      ((this.actividadesUltimos12Meses === 'no' || this.actividadesUltimos12Meses == undefined) || this.actividades12Meses.length) &&
      ((this.actividadesQueRealiza === 'no' || this.actividadesQueRealiza == undefined) || this.actividadesRealiza.length) &&
      ((this.actividadesConyuge === 'no' || this.actividadesConyuge == undefined) || this.actividadesConyugeData.length);

    console.log('listo', listo);
    console.log('listo', listo);
    if (!listo) {
      console.log('paso5 incompleto');
      console.log('paso5 incompleto');
      this.helper.markStepIncomplete(['declaraciones', 'paso5']);

      this.helper.nextStep();
      return;
    }
    console.log('listo', listo);
    console.log('listo', listo);

    this.helper.markStepCompleted(['declaraciones', 'paso5']);
    this.helper.nextStep();
  }
}
