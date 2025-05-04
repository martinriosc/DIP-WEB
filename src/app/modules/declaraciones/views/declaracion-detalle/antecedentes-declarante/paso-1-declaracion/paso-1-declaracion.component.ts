import { Component, OnInit, Optional, SkipSelf } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidadorDeclaracionService } from '../../../../services/validador-declaracion.service';
import { MatStepper } from '@angular/material/stepper';
import { StepperStatusService } from 'src/app/modules/declaraciones/services/stepper-status.service';
import { DeclaracionService } from 'src/app/modules/declaraciones/services/declaracion.service';
import { LocalidadService } from 'src/app/modules/declaraciones/services/localidad.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';

@Component({
  selector: 'app-paso-1-declaracion',
  standalone: false,
  templateUrl: './paso-1-declaracion.component.html',
  styleUrls: ['./paso-1-declaracion.component.scss']
})
export class Paso1DeclaracionComponent implements OnInit {
  formDeclaracion!: FormGroup;


  tipos: any = [];
  periodos: any = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  regiones: any = [];
  comunas: any = [];
  paises: any = [];
  ciudades: any = [];

  declaracionId: number = 0;
  declaranteId: number = 0;

  constructor(
    private fb: FormBuilder,
    private validador: ValidadorDeclaracionService,
    private stepperState: StepperStatusService,
    private _declaracion: DeclaracionService,
    private _localidad: LocalidadService,
    private _declaracionHelper: DeclaracionHelperService,
    @Optional() @SkipSelf() private stepper?: MatStepper
  ) {
    this.formDeclaracion = this.fb.group({
      tipo: ['', Validators.required],
      periodo: ['', Validators.required],
      lugar: ['Chile', Validators.required],
      region: [''],
      comuna: [''],
      pais: [''],
      ciudad: [''],
    });
  }
  ngOnInit(): void {
    this.loadDeclaracion();
    this.loadTipoDeclaracion();
    this.loadRegiones();
  }

  ngAfterViewInit(): void {
    this.formDeclaracion.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        this.validador.markComplete('paso1');
        this.stepperState.markStepCompleted(['declarante', 'paso1']);
      } else {
        this.validador.markIncomplete('paso1');
        this.stepperState.markStepIncomplete(['declarante', 'paso1']);
      }
    });
  }



  loadDeclaracion() {

    //1319527
    const id = this._declaracionHelper.declaracionId;
    this._declaracion.getDeclaracion(1319527).subscribe({
      next: (response: any) => {
        if (response) {
          this.formDeclaracion.patchValue({
            tipo: response.tipoDeclaracion,
            periodo: response.periodo,
            lugar: response.rbLugarDeclaracion ? 'Chile' : 'Extranjero',
            region: response.region
          });

          this.onChangeRegion();

          this.formDeclaracion.patchValue({
            comuna: response.comuna
          })
        }
      },
      error: (error) => {
        console.error('Error al cargar declaración:', error);
      }
    })
  }

  loadTipoDeclaracion() {
    this._declaracion.obtenerTiposDeclaracion().subscribe({
      next: (response) => {

        if (response.length > 0) {
          this.tipos = response;
        }
      },
      error: (error) => {
        console.error('Error al cargar tipos de declaración:', error);
      }
    })
  }

  onChangeNacionalidad(event: any) {
    if (this.formDeclaracion.value.lugar == 'Chile') {
      this.loadRegiones();
    } else {
      this.loadPaises();
    }
  }

  loadRegiones() {
    this._localidad.getRegiones().subscribe({
      next: (response) => {

        this.regiones = response;
      },
      error: (error) => {
        console.error('Error al cargar regiones:', error);
      }
    })
  }

  onChangeRegion() {
    this._localidad.getComunasPorRegion(this.formDeclaracion.value.region).subscribe({
      next: (response) => {

        this.comunas = response;
      },
      error: (error) => {
        console.error('Error al cargar comunas:', error);
      }
    })
  }


  loadPaises() {
    this._localidad.getPaisesExtranjeros().subscribe({
      next: (response) => {

        this.paises = response;
      },
      error: (error) => {
        console.error('Error al cargar paises:', error);
      }
    })
  }


  onSubmit(): void {
    if (this.formDeclaracion.valid) {
      // ya quedó marcado por statusChanges, pero aseguramos:
      this.validador.markComplete('paso1');
      this.stepperState.markStepCompleted(['declarante', 'paso1']);
      // avanzamos al siguiente paso
      this.stepperState.nextStep();
    } else {
      this.validador.markIncomplete('paso1');
      this.stepperState.markStepIncomplete(['declarante', 'paso1']);
    }
  }
}
