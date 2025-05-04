import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  TemplateRef,
  Optional,
  SkipSelf
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ValidadorDeclaracionService } from '../../../../services/validador-declaracion.service';
import { StepperStatusService }        from 'src/app/modules/declaraciones/services/stepper-status.service';
import { InmuebleService } from 'src/app/modules/declaraciones/services/inmueble.service';
import { LocalidadService } from 'src/app/modules/declaraciones/services/localidad.service';
import { MonedaService } from 'src/app/modules/declaraciones/services/moneda.service';
import { MatStepper } from '@angular/material/stepper';
import { Declaracion } from 'src/app/shared/models/AllModels';
import { DeclaracionService } from 'src/app/modules/declaraciones/services/declaracion.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';

interface BienChile {
  region: string;
  comuna: string;
  direccion: string;
  inscripcion: string;
  fojas: string;
  anio: number;
  rolAvaluo: string;
}

interface BienExtranjero {
  pais: string;
  direccion: string;
  observaciones: string;
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
    'region','comuna','direccion','inscripcion','fojas','anio','rolAvaluo', 'conservador','avaluo','fechaAdquisicion','estado','acciones'
  ];

  bienesExtranjero: any[] = [];
  displayedColumnsExtranjero = ['pais','ciudad','direccion','valorCorriente','tipoMoneda','fechaAdquisicion','formaPropiedad','domicilio','estado','accionesExt'];

  @ViewChild('bienChileModal') bienChileModal!: TemplateRef<any>;
  bienChileForm!: FormGroup;
  editChile = false;
  currentChile: BienChile | null = null;

  @ViewChild('bienExtranjeroModal') bienExtranjeroModal!: TemplateRef<any>;
  bienExtranjeroForm!: FormGroup;
  editExtranjero = false;
  currentExtranjero: BienExtranjero | null = null;

  regiones = [];
  comunas  = [];

  conservadoresBienes: any[] = [];
  clasesPropiedad: any[] = [];
  formasPropiedad: any[] = [];
  paises: any[] = [];
  monedas: any[] = [];

  declaracionId: number = 1319527;    //1319527
  declaranteId: number = 2882000;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private stepperState: StepperStatusService,
    private validador: ValidadorDeclaracionService,
    private _inmueble: InmuebleService,
    private _localidad: LocalidadService,
    private _moneda: MonedaService,
    private _declaracionHelper: DeclaracionHelperService,
    @Optional() @SkipSelf() private stepper?: MatStepper
  ) {
 
  }

  ngOnInit(): void {
    this.buildChileForm();
    this.buildExtranjeroForm();
    this.loadBienesInmuebles();
    this.loadBienesInmueblesExtranjero();
    this.loadRegiones();
    this.loadConservadorBienes();
    this.loadClasesPropiedad();
    // this.loadFormasPropiedad();
    this.loadPaises();
    this.loadMonedas();
  }

  ngAfterViewInit(): void {
    this.loadRegistro();
  }

  
  loadRegistro(){
    this._declaracionHelper.declaracionesFlag$.subscribe(data => {
      console.log(data)
      this.tieneExtranjero = data.bienesInmueblesExtranjero ? 'si' : 'no';
      this.tieneChile = data.bienesInmuebles ? 'si' : 'no';
    })
  }



  loadBienesInmuebles() {
    this._inmueble.listarBienesInmuebles(this.declaranteId).subscribe({
      next: (res:any) => {
        console.log(res);
          this.bienesChile = res;
        
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadBienesInmueblesExtranjero() {
    this._inmueble.listarBienesInmueblesExtranjero(this.declaranteId).subscribe({
      next: (res:any) => {
        console.log(res);
        this.bienesExtranjero = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadRegiones(){
    this._localidad.getRegiones().subscribe({
      next: (response:any) => {
        console.log(response)
        this.regiones = response;
      },
      error: (error) => {
        console.error('Error al cargar regiones:', error);
      }
    })
  }

  loadComunas(){
    this._localidad.getComunasPorRegion(this.bienChileForm.value.region).subscribe({
      next: (response:any) => {
        console.log(response)
        this.comunas = response;
      },
      error: (error) => {
        console.error('Error al cargar comunas:', error);
      }
    })
  }

  loadConservadorBienes(){
    this._inmueble.listarAtributos('conservador').subscribe({
      next: (res:any) => {
        console.log(res);
        this.conservadoresBienes = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadClasesPropiedad(){
    this._inmueble.listarAtributos('clase').subscribe({
      next: (res:any) => {
        console.log(res);
        this.clasesPropiedad = res;
        this.formasPropiedad = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadPaises(){
    this._localidad.getPaisesExtranjeros().subscribe({
      next: (response:any) => {
        console.log(response)
        this.paises = response;
      },
      error: (error) => {
        console.error('Error al cargar paises:', error);
      }
    })
  }

  loadMonedas(){
    this._moneda.listar().subscribe({
      next: (response) => {
        console.log(response)
        this.monedas = response.data;
      },
      error: (error) => {
        console.error('Error al cargar monedas:', error);
      }
    })
  }



  onSubmit(): void {
 
    // if (ok) {
    //   this.validador.markComplete(key);
    //   this.stepperState.markStepCompleted(path);
    //   // Avanza al siguiente paso
    //   this.stepperState.nextStep();
    // } else {
    //   this.validador.markIncomplete(key);
    //   this.stepperState.markStepIncomplete(path);
    // }
  }


  openAddChileModal(): void {
    this.editChile = false;
    this.currentChile = null;
    this.buildChileForm();
    this.dialog.open(this.bienChileModal, { width: '800px' });
  }

  openEditChileModal(item: BienChile): void {
    this.editChile = true;
    this.currentChile = item;
    this.buildChileForm(item);
    this.dialog.open(this.bienChileModal, { width: '800px' });
  }

  saveBienChile(dialogRef: any): void {
  //   if (this.bienChileForm.valid) {
  //     const formValue = this.bienChileForm.value as BienChile;
  //     if (this.editChile && this.currentChile) {
  //       const idx = this.bienesChile.indexOf(this.currentChile);
  //       if (idx >= 0) this.bienesChile[idx] = formValue;
  //     } else {
  //       this.bienesChile.push(formValue);
  //     }
  //     dialogRef.close();
  //     // Marca paso como completo ahora que hay al menos un bien
  //     this.validador.markComplete('paso6');
  //     this.stepperState.markStepCompleted(['declaraciones', this.activeDeclId, 'paso6']);
  //   }
  }

  eliminarBien(b: BienChile): void {
  //   this.bienesChile = this.bienesChile.filter(x => x !== b);
  //   if (this.tieneChile === 'si' && this.bienesChile.length === 0) {
  //     this.validador.markIncomplete('paso6');
  //     this.stepperState.markStepIncomplete(['declaraciones', this.activeDeclId, 'paso6']);
  //   }
  }

  onChileChange(value: string): void {
    this.tieneChile = value;
  //   if (value === 'no') {
  //     // Marca como completo si no aplica
  //     this.validador.markComplete('paso6');
  //     this.stepperState.markStepCompleted(['declaraciones', this.activeDeclId, 'paso6']);
  //   }
  }

  private buildChileForm(item?: BienChile): void {
    this.bienChileForm = this.fb.group({
      region      : [item?.region      || '', Validators.required],
      comuna      : [item?.comuna      || '', Validators.required],
      direccion   : [item?.direccion   || '', Validators.required],
      inscripcion : [item?.inscripcion || '', Validators.required],
      fojas       : [item?.fojas       || '', Validators.required],
      anio        : [item?.anio        || new Date().getFullYear(), Validators.required],
      rolAvaluo   : [item?.rolAvaluo   || '', Validators.required]
    });
  }

  // —— Bienes en Exterior ——

  openAddExtranjeroModal(): void {
    this.editExtranjero = false;
    this.currentExtranjero = null;
    this.buildExtranjeroForm();
    this.dialog.open(this.bienExtranjeroModal, { width: '800px' });
  }

  openEditExtranjeroModal(b: BienExtranjero): void {
    this.editExtranjero = true;
    this.currentExtranjero = b;
    this.buildExtranjeroForm(b);
    this.dialog.open(this.bienExtranjeroModal, { width: '800px' });
  }

  saveBienExtranjero(dialogRef: any): void {
  //   if (this.bienExtranjeroForm.valid) {
  //     const formValue = this.bienExtranjeroForm.value as BienExtranjero;
  //     if (this.editExtranjero && this.currentExtranjero) {
  //       const idx = this.bienesExtranjero.indexOf(this.currentExtranjero);
  //       if (idx >= 0) this.bienesExtranjero[idx] = formValue;
  //     } else {
  //       this.bienesExtranjero.push(formValue);
  //     }
  //     dialogRef.close();
  //     this.validador.markComplete('paso6');
  //     this.stepperState.markStepCompleted(['declaraciones', this.activeDeclId, 'paso6']);
  //   }
  }

  eliminarBienExt(b: BienExtranjero): void {
  //   this.bienesExtranjero = this.bienesExtranjero.filter(x => x !== b);
  //   if (this.tieneExtranjero === 'si' && this.bienesExtranjero.length === 0) {
  //     this.validador.markIncomplete('paso6');
  //     this.stepperState.markStepIncomplete(['declaraciones', this.activeDeclId, 'paso6']);
  //   }
  }

  onExtranjeroChange(value: string): void {
    this.tieneExtranjero = value;
  //   if (value === 'no') {
  //     this.validador.markComplete('paso6');
  //     this.stepperState.markStepCompleted(['declaraciones', this.activeDeclId, 'paso6']);
  //   }
  }

  private buildExtranjeroForm(item?: BienExtranjero): void {
    this.bienExtranjeroForm = this.fb.group({
      pais         : [item?.pais         || '', Validators.required],
      direccion    : [item?.direccion    || '', Validators.required],
      observaciones: [item?.observaciones || '', Validators.required]
    });
  }
}
