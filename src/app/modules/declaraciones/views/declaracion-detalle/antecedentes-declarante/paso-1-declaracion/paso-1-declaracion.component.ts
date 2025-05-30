import { Component, OnInit, Optional, SkipSelf } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { DeclaracionService } from 'src/app/modules/declaraciones/services/declaracion.service';
import { LocalidadService } from 'src/app/modules/declaraciones/services/localidad.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
@Component({
  selector: 'app-paso-1-declaracion',
  standalone: false,
  templateUrl: './paso-1-declaracion.component.html',
  styleUrls: ['./paso-1-declaracion.component.scss']
})
export class Paso1DeclaracionComponent implements OnInit {

  isNueva: boolean = false;
  formDeclaracion!: FormGroup;


  tipos: any = [];
  periodos: any = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  regiones: any = [];
  comunas: any = [];
  paises: any = [];
  ciudades: any = [];

  declaracionId: number = this._declaracionHelper.declaracionId;
  declaranteId: number = this._declaracionHelper.declaranteId;

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _declaracion: DeclaracionService,
    private _localidad: LocalidadService,
    private _declaracionHelper: DeclaracionHelperService,
    private _toastr: ToastrService,
    private _spinner: NgxSpinnerService
  ) {
    this.formDeclaracion = this.fb.group({
      tipo: ['', Validators.required],
      periodo: ['', Validators.required],
      lugar: ['', Validators.required],
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



    // this.formDeclaracion.statusChanges.subscribe(status => {
    //   if (status === 'VALID') {
    //     this._declaracionHelper.markStepCompleted(['declarante', 'paso1']);
    //   } else {
    //     this._declaracionHelper.markStepIncomplete(['declarante', 'paso1']);
    //   }
    // });
    // this.formDeclaracion.statusChanges.subscribe(status => {
    //   if (status === 'VALID') {
    //     this._declaracionHelper.markStepCompleted(['declarante', 'paso1']);
    //   } else {
    //     this._declaracionHelper.markStepIncomplete(['declarante', 'paso1']);
    //   }
    // });
  }



  loadDeclaracion() {

    console.log('declaracionId', this.declaracionId)
    console.log('declaranteId', this.declaranteId)

    if (this.declaracionId == 0 && this.declaranteId != 0) {
      this._declaracionHelper.setIsCreating(true);
    } else if (this.declaracionId == 0 && this.declaranteId == 0) {
      this._router.navigate(['declaraciones']);
    } else {
      this._declaracion.getDeclaracion(this.declaracionId).subscribe({
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
    this._spinner.show();
    if (this.formDeclaracion.valid) {
      let obj: any = {
        ciudad: this.formDeclaracion.value.ciudad,
        comuna: this.formDeclaracion.value.comuna,
        pais: this.formDeclaracion.value.pais,
        region: this.formDeclaracion.value.region,
        periodo: this.formDeclaracion.value.periodo,
        rbLugarDeclaracion: this.formDeclaracion.value.lugar == 'Chile' ? true : false,
        tipoDeclaracion: this.formDeclaracion.value.tipo
      }
      if (this._declaracionHelper.isCreating) {
        obj = {
          declaracionId: this.declaracionId,
          ...obj,

        }
      }

      this._declaracion.guardarDeclaracion(obj).subscribe({
        next: (response) => {
          console.log(response)
          if (response.success) {
            this._toastr.success('Datos de la Declaración guardados correctamente');
            this._declaracionHelper.setDeclaracionId(response.data.declaracionId);
            this._declaracionHelper.markStepCompleted(['declarante', 'paso1']);
            this._declaracionHelper.nextStep();
          } else {
            this._toastr.error('Error al guardar Datos de la Declaración');
            this._declaracionHelper.markStepIncomplete(['declarante', 'paso1']);
          }
          this._spinner.hide();
        },
        error: (error) => {
          this._declaracionHelper.markStepIncomplete(['declarante', 'paso1']);
          console.error('Error al guardar declaración:', error);
          this._spinner.hide();

        }
      })
    } else {
      this._toastr.warning('Completa los campos obligatorios');
      this._declaracionHelper.markStepIncomplete(['declarante', 'paso1']);
      this._spinner.hide();

    }
  }
}
