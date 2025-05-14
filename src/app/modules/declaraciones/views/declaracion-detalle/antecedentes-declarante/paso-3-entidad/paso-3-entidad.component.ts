import { DeclaranteService } from 'src/app/modules/declaraciones/services/declarante.service';
import { Component, OnInit, AfterViewInit, Optional, SkipSelf } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ServicioService } from 'src/app/modules/declaraciones/services/servicio.service';
import { MonedaService } from 'src/app/modules/declaraciones/services/moneda.service';
import { MatStepper } from '@angular/material/stepper';
import { LocalidadService } from 'src/app/modules/declaraciones/services/localidad.service';
import { SujetoObligadoService } from 'src/app/modules/declaraciones/services/sujeto-obligado.service';
import { PersonaRelacionadaService } from 'src/app/modules/declaraciones/services/persona-relacionada.service';
import { ProfesionService } from 'src/app/modules/declaraciones/services/profesion.service';
import { DatosLaboralesService } from 'src/app/modules/declaraciones/services/datos-laborales.service';
import { SubnumeralService } from 'src/app/modules/declaraciones/services/subnumeral.service';
import { ServicioAdminService } from 'src/app/modules/administracion/services/servicio-admin.service';
import { DeclaracionService } from 'src/app/modules/declaraciones/services/declaracion.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-paso-3-entidad',
  standalone: false,
  templateUrl: './paso-3-entidad.component.html',
  styleUrls: ['./paso-3-entidad.component.scss']
})
export class Paso3EntidadComponent implements OnInit, AfterViewInit {
  entidadForm!: FormGroup;

  servicios: any[] = [];
  profesiones: any[] = [];
  cargos: any[] = [];
  grados: any[] = [];
  tipoSujetos: any[] = [];
  subnumerales: any[] = [];
  monedas: any[] = [];
  regiones: any[] = [];
  comunas: any[] = [];
  paises: any[] = [];
  ciudades: any[] = [];
  parentescos: any[] = [];
  parientes: any[] = [];

  declaracionId: number = this._declaracionHelper.declaracionId;
  declaranteId: number = this._declaracionHelper.declaranteId;

  servicioId: number = 709;
  sujetoObligadoId: number = 0;
  declaranteRut: string = '15381086-9';
  declaranteRol: number = 1;


  constructor(
    private _declaracionHelper: DeclaracionHelperService,
    private _datosLaborales: DatosLaboralesService,
    private _servicio: ServicioService,
    private _subnumeral: SubnumeralService,
    private _profesion: ProfesionService,
    private _tipoMoneda: MonedaService,
    private _localidad: LocalidadService,
    private _admin: ServicioAdminService,
    private _parentesco: PersonaRelacionadaService,
    private _declaracion: DeclaracionService,
    private _spinner: NgxSpinnerService,
    private _toastr: ToastrService
  ) { }
  ngOnInit(): void {
    this.initForm();
    this.loadCatalogosBase();
  }

  ngAfterViewInit(): void {
    this.loadDatosLaborales();
  }

  /* ─────────────────────────── FORM & CATALOGOS ─────────────────────── */

  private initForm(): void {
    this.entidadForm = new FormGroup({
      servicio: new FormControl('', [Validators.required]),
      cargoFuncion: new FormControl('', [Validators.required]),
      tipoSujeto: new FormControl('', [Validators.required]),
      subnumeral: new FormControl('', [Validators.required]),
      remuneracionTipo: new FormControl('grado'),
      grado: new FormControl(''),
      rentaMensual: new FormControl(''),
      tipoMoneda: new FormControl(''),
      fechaAsuncion: new FormControl('', [Validators.required]),
      lugarDesempeno: new FormControl<'chile' | 'extranjero'>('chile', [Validators.required]),
      regionDesempeno: new FormControl(''),
      comunaDesempeno: new FormControl(''),
      paisDesempeno: new FormControl(''),
      ciudadDesempeno: new FormControl(''),
      jefeServicio: new FormControl(false),
      datosParientes: new FormControl<'true' | 'false'>('false')
    });

    /* reglas dinámicas */
    this.entidadForm.get('remuneracionTipo')!.valueChanges.subscribe(t => {
      if (t === 'grado') {
        this.entidadForm.get('grado')!.setValidators(Validators.required);
        this.entidadForm.get('rentaMensual')!.clearValidators();
        this.entidadForm.get('tipoMoneda')!.clearValidators();
      } else {
        this.entidadForm.get('grado')!.clearValidators();
        this.entidadForm.get('rentaMensual')!.setValidators(Validators.required);
        this.entidadForm.get('tipoMoneda')!.setValidators(Validators.required);
      }
      this.entidadForm.get('grado')!.updateValueAndValidity();
      this.entidadForm.get('rentaMensual')!.updateValueAndValidity();
      this.entidadForm.get('tipoMoneda')!.updateValueAndValidity();
    });

    this.entidadForm.get('lugarDesempeno')!.valueChanges.subscribe(v => {
      if (v === 'chile') {
        // Chile ⇒ región y comuna requeridas
        this.entidadForm.get('regionDesempeno')!.setValidators(Validators.required);
        this.entidadForm.get('comunaDesempeno')!.setValidators(Validators.required);
        // Extranjero ⇒ sin validación
        this.entidadForm.get('paisDesempeno')!.clearValidators();
        this.entidadForm.get('ciudadDesempeno')!.clearValidators();
      } else {
        this.entidadForm.get('regionDesempeno')!.clearValidators();
        this.entidadForm.get('comunaDesempeno')!.clearValidators();
        this.entidadForm.get('paisDesempeno')!.setValidators(Validators.required);
        this.entidadForm.get('ciudadDesempeno')!.setValidators(Validators.required);
      }
      this.entidadForm.get('regionDesempeno')!.updateValueAndValidity();
      this.entidadForm.get('comunaDesempeno')!.updateValueAndValidity();
      this.entidadForm.get('paisDesempeno')!.updateValueAndValidity();
      this.entidadForm.get('ciudadDesempeno')!.updateValueAndValidity();
    });
  }

  private loadCatalogosBase(): void {
    /* servicios (entidades) ligados al declarante */
    this._declaracion
      .obtenerServicios(this.declaranteRut, this.declaranteRol)
      .subscribe({
        next: r => (this.servicios = r.data),
        error: e => console.error(e)
      });

    this.loadTipoSujeto();
    this.loadCargos();
    this.loadGrados();
    this._profesion.listar().subscribe({
      next: (r: any) => (this.profesiones = r),
      error: e => console.error(e)
    });
    this._tipoMoneda.listar().subscribe({
      next: (r: any) => (this.monedas = r),
      error: (e: any) => console.error(e)
    });
    this._localidad.getRegiones().subscribe({
      next: (r: any) => (this.regiones = r),
      error: e => console.error(e)
    });
    this._localidad.getPaisesExtranjeros().subscribe({
      next: (r: any) => (this.paises = r),
      error: e => console.error(e)
    });
  }

  /* ──────────────── Carga dinámica de catálogos dependientes ────────── */

  loadTipoSujeto(): void {
    this._servicio.listarSujetosByServicio(this.servicioId).subscribe({
      next: r => (this.tipoSujetos = r.data),
      error: e => console.error(e)
    });
  }

  loadCargos(): void {
    this._admin.listarCargos(this.servicioId).subscribe({
      next: r => (this.cargos = r.data),
      error: e => console.error(e)
    });
  }

  loadGrados(): void {
    this._admin.listGrados(this.servicioId).subscribe({
      next: r => (this.grados = r.data),
      error: e => console.error(e)
    });
  }

  onServicioChange(ev: MatSelectChange): void {
    this.servicioId = ev.value;
    this.loadCargos();
    this.loadTipoSujeto();
  }

  onTipoSujetoChange(ev: MatSelectChange): void {
    this._subnumeral
      .getBySujetoObligado(ev.value)
      .subscribe({ next: r => (this.subnumerales = r.data || []) });
  }

  onRegionChange(): void {
    const regionId = this.entidadForm.value.regionDesempeno;
    if (regionId) {
      this._localidad.getComunasPorRegion(regionId).subscribe({
        next: (r: any) => (this.comunas = r),
        error: e => console.error(e)
      });
    }
  }

  /* ─────────────────────────── DATOS ORIGINALES ─────────────────────── */

  private loadDatosLaborales(): void {
    this._datosLaborales.getDatosLaborales(this.declaracionId).subscribe({
      next: resp => {
        if (!resp.data) {
          return;
        }
        const d = resp.data;

        /* mapeo a controles */
        this.entidadForm.patchValue({
          servicio: d.ServPublicoId,
          cargoFuncion: d.cargoNombre,
          tipoSujeto: d.sujetoObligado,
          subnumeral: d.subNumeral,
          grado: d.ServGradoId,
          rentaMensual: d.rentaMensual,
          remuneracionTipo: d.remuneracionTipo,
          fechaAsuncion: this.toIso(d.fechaAsuncion),
          lugarDesempeno: d.rbLugarDesempeno ? 'chile' : 'extranjero',
          regionDesempeno: d.regionId,
          comunaDesempeno: d.comunaId,
          paisDesempeno: d.paisDesempeno,
          ciudadDesempeno: d.ciudadDesempeno,
          jefeServicio: d.jefeServicio,
          datosParientes: d.rbAplicaParientes ? 'true' : 'false'
        });

        /* disparar catálogos dependientes */
        this.onServicioChange({ value: d.ServPublicoId } as MatSelectChange);
        this.onTipoSujetoChange({ value: d.sujetoObligado } as MatSelectChange);
        if (d.regionId) this.onRegionChange();
      },
      error: e => console.error(e)
    });

    /* parientes (si los hubiera) */
    this.refreshParientes();
  }


  onChangeServicio(event: any) {
    this.servicioId = event.value;
    this.loadCargos()

    this.loadTipoSujetos();
  }

  loadProfesiones() {
    this._profesion.listar().subscribe({
      next: (response: any) => {
        this.profesiones = response;
      },
      error: (error) => {
        console.error('Error al cargar profesiones:', error);
      }
    })
  }


  loadTipoSujetos() {
    this._servicio.listarSujetosByServicio(this.servicioId).subscribe({
      next: (response: any) => {
        this.tipoSujetos = response;
      },
      error: (error) => {
        console.error('Error al cargar profesiones:', error);
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
      }
    })
  }

  onChangeRegion() {
    this._localidad.getComunasPorRegion(this.entidadForm.value.regionDesempeno).subscribe({
      next: (response: any) => {
        this.comunas = response;

      },
      error: (error) => {
        console.error('Error al cargar comunas:', error);
      }
    })
  }


  loadComunas() {
    this._localidad.getComunasPorRegion(this.entidadForm.value.regionDesempeno).subscribe({
      next: (response: any) => {
        this.comunas = response;
      },
      error: (error) => {
        console.error('Error al cargar comunas:', error);
      }
    })
  }

  onChangeNacionalidad(event: any) {
    if (this.entidadForm.value.lugarDesempeno == 'Chile') {
      this.loadRegiones();
    } else {
      this.loadPaises();
    }
  }

  loadPaises() {
    this._localidad.getPaisesExtranjeros().subscribe({
      next: (response: any) => {
        this.paises = response;
      },
      error: (error) => {
        console.error('Error al cargar paises:', error);
      }
    })
  }



  loadPersonasRelacionadas() {
    this._parentesco.listarParientes(this.declaracionId).subscribe({
      next: (response: any) => {
        this.parentescos = response;
      },
      error: (error) => {
        console.error('Error al cargar personas relacionadas:', error);
      }
    })
  }


  onChangeRemuneracion(event: any) {
    this.entidadForm.controls['remuneracionTipo'].setValue(event);
  }

  onChangeTipoSujeto(event: any) {

    this.loadSubnumerales(event.value);
  }

  loadSubnumerales(sujetoObligadoId: number) {
    this._subnumeral.getBySujetoObligado(sujetoObligadoId).subscribe({
      next: (response: any) => {
        if (response.data) {
          this.subnumerales = response.data;
        }
      },
      error: (error) => {
        console.error('Error al cargar subnumerales:', error);
      }
    })
  }

  onChangeSubnumeral(event: any) {
  }


  onSubmit(): void {
    if (this.entidadForm.invalid) {
      this._toastr.error('Complete los campos requeridos');
      this._declaracionHelper.markStepIncomplete(['declarante', 'paso3']);
      return;
    }

    this._spinner.show();

    /* construir payload según reglas del backend */
    const f = this.entidadForm.value;
    const payload: any = {
      ServPublicoId: this.toNumberOrNull(f.servicio),
      cargo: this.getIdCargoByNombreCargo(f.cargoFuncion),
      sujetoObligado: this.toNumberOrNull(f.tipoSujeto),
      remuneracionTipo: f.remuneracionTipo,
      fechaAsuncion: this.toDMY(f.fechaAsuncion),
      rbLugarDesempeno: f.lugarDesempeno === 'chile',
      jefeServicio: !!f.jefeServicio,
      rbAplicaParientes: f.datosParientes === 'true'
    };

    if (f.subnumeral) payload.subNumeral = this.toNumberOrNull(f.subnumeral);

    /* bloque grado / renta */
    if (f.remuneracionTipo === 'grado') {
      payload.ServGradoId = this.toNumberOrNull(f.grado);
    } else {
      payload.remuneracionMensual = f.rentaMensual;
      payload.monedaId = this.toNumberOrNull(f.tipoMoneda);
    }

    /* lugar de desempeño */
    if (payload.rbLugarDesempeno) {
      payload.regionId = this.toNumberOrNull(f.regionDesempeno);
      payload.comunaId = this.toNumberOrNull(f.comunaDesempeno);
    } else {
      payload.paisId = this.toNumberOrNull(f.paisDesempeno);
      payload.ciudad = f.ciudadDesempeno;
    }

    this._datosLaborales.guardar(payload, this.declaracionId).subscribe({
      next: res => {
        this._spinner.hide();
        if (res.body?.success) {
          this._toastr.success('Datos laborales guardados');
          this._declaracionHelper.markStepCompleted(['declarante', 'paso3']);

          /* si “aplica parientes” == true → refrescar tabla para poder agregarlos */
          if (payload.rbAplicaParientes) {
            this.refreshParientes();
          }

          this._declaracionHelper.nextStep();
        } else {
          this.handleError();
        }
      },
      error: () => this.handleError()
    });
  }

  getIdCargoByNombreCargo(cargo: string) {
    return this.cargos.find(c => c.cargo === cargo)?.id;
  }

  /* ──────────────────────── PARIENTES ──────────────────────── */

  /** Abre un diálogo / formulario – aquí solo se muestra ejemplo de estructura */
  onAgregarPariente(): void {
    // idealmente abrirías un mat-dialog; este ejemplo usa prompt rápidos
    const nombre = prompt('Nombre pariente');
    if (!nombre) return;

    const parienteDTO = {
      id: '',
      parentescoId: 4,
      rut: prompt('RUT pariente') || '',
      nombre,
      apellidoPaterno: prompt('Apellido paterno') || '',
      apellidoMaterno: prompt('Apellido materno') || '',
      fechaNacimiento: this.toDMY(prompt('Fecha nacimiento (YYYY-MM-DD)') || '')
    };

    this._parentesco
      .guardarPariente(parienteDTO, this.declaracionId)
      .subscribe({
        next: r => {
          if (r.success) {
            this._toastr.success('Pariente guardado');
            this.refreshParientes();
          } else {
            this._toastr.error('No se pudo guardar el pariente');
          }
        },
        error: () => this._toastr.error('Error al guardar pariente')
      });
  }

  refreshParientes() {
    this._parentesco.listarParientes(this.declaracionId).subscribe({
      next: (r: any) => {
        (this.parientes = r || [])
      },
      error: e => console.error(e)
    });
  }

  /* ──────────────────────────── HELPERS ────────────────────────────── */

  private toDMY(isoDate: string): string {
    if (!isoDate) return '';
    const [y, m, d] = isoDate.split('-');
    return `${d}/${m}/${y}`;
  }

  private toIso(dmy: string): string {
    if (!dmy) return '';
    const [d, m, y] = dmy.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  private toNumberOrNull(val: any): number | null {
    const n = Number(val);
    return isNaN(n) ? null : n;
  }

  private handleError(): void {
    this._spinner.hide();
    this._toastr.error('Error al guardar Datos Laborales');
    this._declaracionHelper.markStepIncomplete(['declarante', 'paso3']);
  }
}