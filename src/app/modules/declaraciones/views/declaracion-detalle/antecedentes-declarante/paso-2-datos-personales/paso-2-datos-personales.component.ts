import { Component, OnInit, AfterViewInit, Optional, SkipSelf } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ValidadorDeclaracionService } from '../../../../services/validador-declaracion.service';
import { StepperStatusService } from 'src/app/modules/declaraciones/services/stepper-status.service';
import { ProfesionService } from 'src/app/modules/declaraciones/services/profesion.service';
import { EstadoCivilService } from 'src/app/modules/declaraciones/services/estado-civil.service';
import { MatStepper } from '@angular/material/stepper';
import { LocalidadService } from 'src/app/modules/declaraciones/services/localidad.service';
import { RegimenPatrimonialService } from 'src/app/modules/declaraciones/services/regimen-patrimonial.service';
import { DeclaranteService } from 'src/app/modules/declaraciones/services/declarante.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';

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
    @Optional() @SkipSelf() private stepper?: MatStepper
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
    //1319527

    this._declarante.getDatosDeclarante(1319527).subscribe(res => {
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
    if (this.datosPersonalesForm.valid) {
      // Aseguramos la marca en ambos servicios
      this._declaracionHelper.markStepCompleted(['declarante', 'paso2']);
      this._declaracionHelper.nextStep();
    } else {
      this._declaracionHelper.markStepIncomplete(['declarante', 'paso2']);
    }
  }
}
