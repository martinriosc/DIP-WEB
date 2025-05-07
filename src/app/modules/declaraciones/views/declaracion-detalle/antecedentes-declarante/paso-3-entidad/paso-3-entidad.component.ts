import { Component, OnInit, AfterViewInit, Optional, SkipSelf } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ValidadorDeclaracionService } from '../../../../services/validador-declaracion.service';
import { StepperStatusService } from 'src/app/modules/declaraciones/services/stepper-status.service';
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

  declaracionId: number = 0;
  servicioId: number = 709;
  sujetoObligadoId: number = 0;
  declaranteRut: string = '15381086-9';
  declaranteRol: number = 1;


  constructor(
    private _declaracionHelper: DeclaracionHelperService,
    private _datosLaborales: DatosLaboralesService,
    private _servicio: ServicioService,
    private _sujetoObligado: SujetoObligadoService,
    private _subnumeral: SubnumeralService,
    private _profesion: ProfesionService,
    private _tipoMoneda: MonedaService,
    private _localidad: LocalidadService,
    private _admin: ServicioAdminService,
    private _parentesco: PersonaRelacionadaService,
    private _declaracion: DeclaracionService,
    @Optional() @SkipSelf() private stepper?: MatStepper
  ) { }

  ngOnInit() {
    this.entidadForm = new FormGroup({
      servicio: new FormControl('', [Validators.required]),
      cargoFuncion: new FormControl('', [Validators.required]),
      tipoSujeto: new FormControl('', [Validators.required]),
      subnumeral: new FormControl('', [Validators.required]),
      grado: new FormControl('', [Validators.required]),
      rentaMensual: new FormControl('', [Validators.required]),
      fechaAsuncion: new FormControl('', [Validators.required]),
      lugarDesempeno: new FormControl('chile', [Validators.required]),
      regionDesempeno: new FormControl(''),
      comunaDesempeno: new FormControl(''),
      paisDesempeno: new FormControl(''),
      ciudadDesempeno: new FormControl(''),
      jefeServicio: new FormControl('false'),
      remuneracionTipo: new FormControl('grado'),
      tipoMoneda: new FormControl('', [Validators.required]),
      datosParientes: new FormControl(false)
    });
    this.loadDatosEntidad();
    this.loadTipoSujetos();
    this.loadProfesiones();
    this.loadCargos();
    this.loadGrados();
    this.loadMonedas();
    this.loadRegiones();
    this.loadPaises();
  }

  ngAfterViewInit(): void {
    this.loadDatosLaborales();

  }



  loadDatosLaborales() {
    //1319527

    this._datosLaborales.getDatosLaborales(1319527).subscribe({

      next: (response) => {
        
        this.entidadForm.patchValue({
          servicio: response.data.ServPublicoId,
          cargoFuncion: response.data.cargoNombre,
          tipoSujeto: response.data.sujetoObligado,
          subnumeral: response.data.subNumeral,
          grado: response.data.ServGradoId,
          rentaMensual: response.data.rentaMensual,
          lugarDesempeno: response.data.rbLugarDesempeno ? 'chile' : 'extranjero',
          regionDesempeno: response.data.regionId,
          comunaDesempeno: response.data.comunaId,
          paisDesempeno: response.data.paisDesempeno,
          ciudadDesempeno: response.data.ciudadDesempeno,
          jefeServicio: response.data.jefeServicio,
          remuneracionTipo: response.data.remuneracionTipo,
          tipoMoneda: response.data.monedaId,
          datosParientes: response.data.rbAplicaParientes ? 'true' : 'false'
        });


        // El formato de la fecha de mas abajo llega como DD/MM/YYYY pero necesito convertirlo a YYYY/MM/DD
        const date = new Date(response.data.fechaAsuncion);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        this.entidadForm.patchValue({
          fechaAsuncion: formattedDate
        })

        this.onChangeServicio({ value: response.data.ServPublicoId })
        this.onChangeRegion()
        this.entidadForm.patchValue({
          subnumeral: response.data.subNumeral
        })


        this.onChangeTipoSujeto({ value: response.data.sujetoObligado })
        this.onChangeSubnumeral({ value: response.data.subNumeral })
      },
      error: (error) => {
        console.error('Error al cargar subnumerales:', error);
      }
    })
  }

  loadDatosEntidad() {
    this._declaracion.obtenerServicios(this.declaranteRut, this.declaranteRol).subscribe({
      next: (response) => {
        this.servicios = response.data;
      },
      error: (error) => {
        console.error('Error al cargar subnumerales:', error);
      }
    })
  }

  loadTipoSujetos() {
    this._servicio.listarSujetosByServicio(this.servicioId).subscribe({
      next: (response: any) => {
        this.tipoSujetos = response.data;
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
      }
    })
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

  loadCargos() {
    this._admin.listarCargos(this.servicioId).subscribe({
      next: (response: any) => {
        
        this.cargos = response.data;
      },
      error: (error) => {
        console.error('Error al cargar cargos:', error);
      }
    })
  }

  loadGrados() {
    this._admin.listGrados(this.servicioId).subscribe({
      next: (response: any) => {
        this.grados = response.data;
      },
      error: (error) => {
        console.error('Error al cargar grados:', error);
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

  // loadSujetoObligados() {
  //   this._sujetoObligado.getByServicio(this.servicioId).subscribe({
  //     next: (response:any) => {
  //       console.log(response.data)
  //       this.tipoSujetos = [response.data];
  //     },
  //     error: (error) => {
  //       console.error('Error al cargar sujetos obligados:', error);
  //     }
  //   })
  // }

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

  loadMonedas() {
    this._tipoMoneda.listar().subscribe({
      next: (response: any) => {
        this.monedas = response;
      },
      error: (error) => {
        console.error('Error al cargar monedas:', error);
      }
    })
  }

  // ngAfterViewInit() {
  //   // Marca complete/incomplete según el estado del formulario
  //   this.entidadForm.statusChanges.subscribe(status => {
  //     if (status === 'VALID') {
  //       this.validador.markComplete('paso3');
  //       this.stepperState.markStepCompleted(['declarante', 'paso3']);
  //     } else {
  //       this.validador.markIncomplete('paso3');
  //       this.stepperState.markStepIncomplete(['declarante', 'paso3']);
  //     }
  //   });
  // }

  /** Guardar + avanzar */
  onSubmit(): void {
    if (this.entidadForm.valid) {
      this._declaracionHelper.markStepCompleted(['declarante', 'paso3']);
      this._declaracionHelper.nextStep();
    } else {
      this._declaracionHelper.markStepIncomplete(['declarante', 'paso3']);
    }
  }
}
