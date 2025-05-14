import { Component, OnInit, AfterViewInit, Optional, SkipSelf } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProfesionService } from 'src/app/modules/declaraciones/services/profesion.service';
import { EstadoCivilService } from 'src/app/modules/declaraciones/services/estado-civil.service';
import { MatStepper } from '@angular/material/stepper';
import { LocalidadService } from 'src/app/modules/declaraciones/services/localidad.service';
import { RegimenPatrimonialService } from 'src/app/modules/declaraciones/services/regimen-patrimonial.service';
import { DeclaranteService } from 'src/app/modules/declaraciones/services/declarante.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-paso-2-datos-personales',
  standalone: false,
  templateUrl: './paso-2-datos-personales.component.html',
  styleUrls: ['./paso-2-datos-personales.component.scss']
})
export class Paso2DatosPersonalesComponent implements OnInit, AfterViewInit {
  datosPersonalesForm!: FormGroup;

  profesiones: any[] = [];
  regiones: any[] = [];
  comunas: any[] = [];
  paises: any[] = [];
  ciudades: any[] = [];
  regimenes: any[] = [];
  regimenesFiltered: any[] = [];
  estadosCiviles: any[] = [];

  conyugeFlag: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _declaracionHelper: DeclaracionHelperService,
    private _declarante: DeclaranteService,
    private _profesion: ProfesionService,
    private _localidad: LocalidadService,
    private _estadoCivil: EstadoCivilService,
    private _regimen: RegimenPatrimonialService,
    private _toastr: ToastrService,
    private _spinner: NgxSpinnerService
  ) {
    this.datosPersonalesForm = this.fb.group({
      rut: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      profesion: ['', Validators.required],
      lugarReside: ['chile', Validators.required],
      region: ['', Validators.required],
      comuna: ['', Validators.required],
      pais: [''],
      ciudad: [''],
      domicilioCalle: ['', Validators.required],
      domicilioNumero: ['', Validators.required],
      domicilioDepto: [''],
      estadoCivil: ['', Validators.required],
      regimenPatrimonial: ['', Validators.required],
      rutConyuge: ['', Validators.required],
      nombresConyuge: ['', Validators.required],
      apellidoPaternoConyuge: ['', Validators.required],
      apellidoMaternoConyuge: ['', Validators.required],
      declaraConyuge: ['no', Validators.required],
    });
  }

  declaracionId: number = this._declaracionHelper.declaracionId;
  declaranteId: number = this._declaracionHelper.declaranteId;

  ngOnInit(): void {

    this.loadProfesiones();
    this.loadRegiones();
    this.loadPaises();
    this.loadRegimenes();
    this.loadEstadosCiviles();


    this.loadDatosPersonales();

  }

  ngAfterViewInit(): void {
    // Escucha validez y marca complete/incomplete
    this.datosPersonalesForm.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        this._declaracionHelper.markStepCompleted(['declarante', 'paso2']);
      } else {
        this._declaracionHelper.markStepIncomplete(['declarante', 'paso2']);
      }
    });
  }

  loadDatosPersonales() {

    this._declarante.getDatosDeclarante(this._declaracionHelper.declaracionId).subscribe(res => {
      this.onChangeEstadoCivil(res.estadoCivil);
      this.datosPersonalesForm.patchValue({
        rut: res.rut,
        nombres: res.nombre,
        apellidoPaterno: res.apellidoPaterno,
        apellidoMaterno: res.apellidoMaterno,
        profesion: res.profesionId,
        lugarReside: res.direccionChilena ? 'chile' : 'extranjero',
        region: res.regionId,
        domicilioCalle: res.calle,
        domicilioNumero: res.numero,
        domicilioDepto: res.departamento,
        regimenPatrimonial: res.regimenPatrimonialId,
        estadoCivil: res.estadoCivil,
        rutConyuge: res.cygRut,
        nombresConyuge: res.cygNombre,
        apellidoPaternoConyuge: res.cygApellidoPaterno,
        apellidoMaternoConyuge: res.cygApellidoMaterno,
        declaraConyuge: res.cygForm ? 'si' : 'no',
      })
      this.onChangeRegion();
      this.onChangeEstadoCivil(res.estadoCivil);
      this.datosPersonalesForm.patchValue({
        comuna: res.comunaId
      })
    })
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

  loadRegimenes() {
    this._regimen.listar().subscribe({
      next: (response: any) => {
        this.regimenes = response;

      },
      error: (error) => {
        console.error('Error al cargar regimenes:', error);
      }
    })
  }

  loadEstadosCiviles() {
    this._estadoCivil.listar().subscribe({
      next: (response: any) => {
        this.estadosCiviles = response;

      },
      error: (error) => {
        console.error('Error al cargar estados civiles:', error);
      }
    })
  }

  onChangeEstadoCivil(event: any) {
    let value = null;

    if (event.value == null) {
      value = event;
    } else {
      value = event.value;
    }

    if (value == 2 || value == 5) {
      this.conyugeFlag = true;
      this.datosPersonalesForm.get('rutConyuge')?.enable();
      this.datosPersonalesForm.get('nombresConyuge')?.enable();
      this.datosPersonalesForm.get('apellidoPaternoConyuge')?.enable();
      this.datosPersonalesForm.get('apellidoMaternoConyuge')?.enable();
      this.datosPersonalesForm.get('declaraConyuge')?.enable();

      if (value == 2) {
        this.regimenesFiltered = this.regimenes.filter((regimen) => regimen.id == 1 || regimen.id == 2 || regimen.id == 3);
      } else if (event.value == 5) {
        this.regimenesFiltered = this.regimenes.filter((regimen) => regimen.id == 3 || regimen.id == 4);
      }
    } else {
      this.conyugeFlag = false;
      this.regimenesFiltered = [{
        id: 5,
        nombre: 'NO APLICA'
      }]
      this.datosPersonalesForm.get('rutConyuge')?.disable();
      this.datosPersonalesForm.get('nombresConyuge')?.disable();
      this.datosPersonalesForm.get('apellidoPaternoConyuge')?.disable();
      this.datosPersonalesForm.get('apellidoMaternoConyuge')?.disable();
      this.datosPersonalesForm.get('declaraConyuge')?.disable();
    }
  }

  onChangeNacionalidad(event: any) {
    if (this.datosPersonalesForm.value.lugarReside == 'chile') {
      this.loadRegiones();
    } else {
      this.loadPaises();
    }
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
    this._localidad.getComunasPorRegion(this.datosPersonalesForm.value.region).subscribe({
      next: (response: any) => {
        this.comunas = response;

      },
      error: (error) => {
        console.error('Error al cargar comunas:', error);
      }
    })
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



  onSubmit(): void {
    this._spinner.show();
    if (this.datosPersonalesForm.valid) {
      const obj = {
        rut: this.datosPersonalesForm.value.rut,
        nombre: this.datosPersonalesForm.value.nombres,
        apellidoPaterno: this.datosPersonalesForm.value.apellidoPaterno,
        apellidoMaterno: this.datosPersonalesForm.value.apellidoMaterno,
        profesionId: this.datosPersonalesForm.value.profesion,
        direccionChilena: this.datosPersonalesForm.value.lugarReside == 'chile' ? true : false,
        regionId: this.datosPersonalesForm.value.region,
        comunaId: this.datosPersonalesForm.value.comuna,
        calle: this.datosPersonalesForm.value.domicilioCalle,
        numero: this.datosPersonalesForm.value.domicilioNumero,
        departamento: this.datosPersonalesForm.value.domicilioDepto,
        estadoCivil: this.datosPersonalesForm.value.estadoCivil,
        regimenPatrimonialId: this.datosPersonalesForm.value.regimenPatrimonial,
        cygDeclaranteId: '',
        cygRut: this.datosPersonalesForm.value.rutConyuge,
        cygNombre: this.datosPersonalesForm.value.nombresConyuge,
        cygApellidoPaterno: this.datosPersonalesForm.value.apellidoPaternoConyuge,
        cygApellidoMaterno: this.datosPersonalesForm.value.apellidoMaternoConyuge,
        cygForm: this.datosPersonalesForm.value.declaraConyuge == 'si' ? true : false
      }

      this._declarante.guardarDeclarante(obj, this.declaracionId).subscribe({
        next: (response) => {
          if (response.status == 200) {
            this._toastr.success('Datos del Declarante guardados correctamente');
            this._declaracionHelper.markStepCompleted(['declarante', 'paso2']);
            this._declaracionHelper.nextStep();
          } else {
            this._toastr.error('Error al guardar Datos del Declarante');
            this._declaracionHelper.markStepIncomplete(['declarante', 'paso2']);
          }
          this._spinner.hide();
        },
        error: (error) => {
          this._declaracionHelper.markStepIncomplete(['declarante', 'paso2']);
          console.error('Error al guardar Declarante:', error);
          this._spinner.hide();
        }
      })

    } else {
      this._toastr.error('Error al guardar Datos del Declarante');
      this._spinner.hide();
      this._declaracionHelper.markStepIncomplete(['declarante', 'paso2']);
    }
  }
}
