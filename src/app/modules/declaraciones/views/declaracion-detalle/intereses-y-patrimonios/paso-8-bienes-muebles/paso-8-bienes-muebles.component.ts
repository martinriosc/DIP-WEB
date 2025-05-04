import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ValidadorDeclaracionService } from '../../../../services/validador-declaracion.service';
import { StepperStatusService } from 'src/app/modules/declaraciones/services/stepper-status.service';
import { BienMuebleService } from 'src/app/modules/declaraciones/services/bien-mueble.service';
import { InmuebleService } from 'src/app/modules/declaraciones/services/inmueble.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';

// ===== Interfaces =====
interface Vehiculo {
  tipo: string;
  marca: string;
  modelo: string;
  anio: number;
  patente: string;
  valor: number;
}
interface Aeronave {
  tipo: string;
  marca: string;
  modelo: string;
  anio: number;
  matricula: string;
  valor: number;
}
interface Nave {
  tipo: string;
  registro: string;
  anio: number;
  valor: number;
}
interface OtroBien {
  tipo: string;
  descripcion: string;
  valor: number;
}

@Component({
  selector: 'app-paso-8-bienes-muebles',
  standalone: false,
  templateUrl: './paso-8-bienes-muebles.component.html',
  styleUrls: ['./paso-8-bienes-muebles.component.scss']
})
export class Paso8BienesMueblesComponent implements OnInit {
  // Radios
  tieneVehiculos = 'no';
  tieneAeronaves = 'no';
  tieneNaves = 'no';
  tieneOtrosBienes = 'no';

  // 1) Vehículos
  vehiculosData: Vehiculo[] = [];
  @ViewChild('vehiculoModal') vehiculoModal!: TemplateRef<any>;
  vehiculoForm!: FormGroup;
  editVehiculo = false;
  currentVehiculo: Vehiculo | null = null;

  // 2) Aeronaves
  aeronavesData: Aeronave[] = [];
  @ViewChild('aeronaveModal') aeronaveModal!: TemplateRef<any>;
  aeronaveForm!: FormGroup;
  editAeronave = false;
  currentAeronave: Aeronave | null = null;

  // 3) Naves
  navesData: Nave[] = [];
  @ViewChild('naveModal') naveModal!: TemplateRef<any>;
  naveForm!: FormGroup;
  editNave = false;
  currentNave: Nave | null = null;

  // 4) Otros bienes
  otrosBienesData: OtroBien[] = [];
  @ViewChild('otroBienModal') otroBienModal!: TemplateRef<any>;
  otroBienForm!: FormGroup;
  editOtroBien = false;
  currentOtroBien: OtroBien | null = null;

  // ID de la declaración activa
  private activeDeclId!: string;

  vehiculosLivianos: any[] = [];
  aeronaves: any[] = [];
  naves: any[] = [];
  otrosBienes: any[] = [];

  tiposVehiculos: any[] = [];
  marcasVehiculos: any[] = [];
  gravamenes: any[] = [];


  declaracionId: number = 1319527;    //1319527
  declaranteId: number = 2882000;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private stepperState: StepperStatusService,
    private validador: ValidadorDeclaracionService,
    private _bienMueble: BienMuebleService,
    private _inmueble: InmuebleService,
    private _declaracionHelper: DeclaracionHelperService
  ) { }

  ngOnInit(): void {
    // Recupera el ID de declaración activa
    this.stepperState.activeId$.subscribe(id => this.activeDeclId = id);
    // Inicializa todos los formularios de modal
    this.buildVehiculoForm();
    this.buildAeronaveForm();
    this.buildNaveForm();
    this.buildOtroBienForm();

    this.loadBienes();
    this.loadTiposVehiculos(1);
    this.loadMarcasVehiculos(1);
    this.loadDesgravamen('desgravamen');
  }


  ngAfterViewInit(): void {
    this.loadRegistro();
  }

  
  loadRegistro(){
    this._declaracionHelper.declaracionesFlag$.subscribe(data => {
      console.log(data)
      this.tieneVehiculos = data.vehiculos ? 'si' : 'no';
      this.tieneAeronaves = data.aeronaves ? 'si' : 'no';
      this.tieneNaves = data.naves ? 'si' : 'no';
      this.tieneOtrosBienes = data.otrosBienes ? 'si' : 'no';
    })
  }

  loadBienes() {
    this._bienMueble.listarVehiculos([1], this.declaranteId).subscribe({
      next: (res: any) => {
        console.log(res)
        if(res.length > 0){
          this.tieneVehiculos = 'si';
          this.vehiculosLivianos = res;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })

    this._bienMueble.listarVehiculos([2], this.declaranteId).subscribe({
      next: (res: any) => {
        console.log(res)
        if(res.length > 0){
          this.tieneAeronaves = 'si';
          this.aeronaves = res;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })

    this._bienMueble.listarVehiculos([3], this.declaranteId).subscribe({
      next: (res: any) => {
        console.log(res)
        if(res.length > 0){
          this.tieneNaves = 'si';
          this.naves = res;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })

    this._bienMueble.listar(this.declaranteId).subscribe({
      next: (res: any) => {
        console.log(res)
        if(res.length > 0){
          this.tieneOtrosBienes = 'si';
          this.otrosBienes = res;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })

  
  }

  loadTiposVehiculos(tipoVehiculo: number){
this._bienMueble.listarAtributosVehiculo('vehiculoTipo', tipoVehiculo).subscribe({
  next: (res: any) => {
    console.log(res)
    this.tiposVehiculos = res;
  },
  error: (err) => {
    console.log(err);
  }
})
  }

  loadMarcasVehiculos(tipoVehiculo: number){
    this._bienMueble.listarAtributosVehiculo('vehiculoMarca', tipoVehiculo).subscribe({
      next: (res: any) => {
        console.log(res)
        this.marcasVehiculos = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadDesgravamen(tipoDesgravamen: string){
    this._inmueble.listarAtributos('desgravamen', tipoDesgravamen).subscribe({
      next: (res: any) => {
        console.log(res)
        this.gravamenes = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }




  /** Guarda y avanza */
  onSubmit(): void {
    const ok =
      (this.tieneVehiculos === 'si' && this.vehiculosData.length > 0) ||
      (this.tieneAeronaves === 'si' && this.aeronavesData.length > 0) ||
      (this.tieneNaves === 'si' && this.navesData.length > 0) ||
      (this.tieneOtrosBienes === 'si' && this.otrosBienesData.length > 0) ||
      (this.tieneVehiculos === 'no' && this.tieneAeronaves === 'no' && this.tieneNaves === 'no' && this.tieneOtrosBienes === 'no');

    const key = 'paso8';
    const path = ['declaraciones', this.activeDeclId, key];

    if (ok) {
      this.markComplete(path, key);
      this.stepperState.nextStep();
    } else {
      this.markIncomplete(path, key);
    }
  }

  // ─── Vehículos ─────────────────────────────────────────────────────────────

  openAddVehiculoModal(): void {
    this.editVehiculo = false;
    this.currentVehiculo = null;
    this.buildVehiculoForm();
    this.dialog.open(this.vehiculoModal, { width: '800px' });
  }

  openEditVehiculoModal(item: Vehiculo): void {
    this.editVehiculo = true;
    this.currentVehiculo = item;
    this.buildVehiculoForm(item);
    this.dialog.open(this.vehiculoModal, { width: '800px' });
  }

  buildVehiculoForm(item?: Vehiculo): void {
    this.vehiculoForm = this.fb.group({
      tipo: [item?.tipo || 'Liviano', Validators.required],
      marca: [item?.marca || '', Validators.required],
      modelo: [item?.modelo || '', Validators.required],
      anio: [item?.anio || new Date().getFullYear(), [Validators.required, Validators.min(1900)]],
      patente: [item?.patente || '', Validators.required],
      valor: [item?.valor || 0, [Validators.required, Validators.min(0)]]
    });
  }

  saveVehiculo(dialogRef: any): void {
    if (this.vehiculoForm.valid) {
      const v = this.vehiculoForm.value as Vehiculo;
      if (this.editVehiculo && this.currentVehiculo) {
        const i = this.vehiculosData.indexOf(this.currentVehiculo);
        if (i >= 0) this.vehiculosData[i] = v;
      } else {
        this.vehiculosData.push(v);
      }
      dialogRef.close();
      this.markComplete(['declaraciones', this.activeDeclId, 'paso8'], 'paso8');
    }
  }

  eliminarVehiculo(v: Vehiculo): void {
    this.vehiculosData = this.vehiculosData.filter(x => x !== v);
    if (this.tieneVehiculos === 'si' && this.vehiculosData.length === 0) {
      this.markIncomplete(['declaraciones', this.activeDeclId, 'paso8'], 'paso8');
    }
  }

  onTieneVehiculosChange(value: string): void {
    this.tieneVehiculos = value;
    if (value === 'no') {
      this.markIncomplete(['declaraciones', this.activeDeclId, 'paso8'], 'paso8');
    }
  }

  // ─── Aeronaves ─────────────────────────────────────────────────────────────

  openAddAeronaveModal(): void {
    this.editAeronave = false;
    this.currentAeronave = null;
    this.buildAeronaveForm();
    this.dialog.open(this.aeronaveModal, { width: '800px' });
  }

  openEditAeronaveModal(item: Aeronave): void {
    this.editAeronave = true;
    this.currentAeronave = item;
    this.buildAeronaveForm(item);
    this.dialog.open(this.aeronaveModal, { width: '800px' });
  }

  buildAeronaveForm(item?: Aeronave): void {
    this.aeronaveForm = this.fb.group({
      tipo: [item?.tipo || 'Avión', Validators.required],
      marca: [item?.marca || '', Validators.required],
      modelo: [item?.modelo || '', Validators.required],
      anio: [item?.anio || new Date().getFullYear(), [Validators.required, Validators.min(1900)]],
      matricula: [item?.matricula || '', Validators.required],
      valor: [item?.valor || 0, [Validators.required, Validators.min(0)]]
    });
  }

  saveAeronave(dialogRef: any): void {
    if (this.aeronaveForm.valid) {
      const a = this.aeronaveForm.value as Aeronave;
      if (this.editAeronave && this.currentAeronave) {
        const i = this.aeronavesData.indexOf(this.currentAeronave);
        if (i >= 0) this.aeronavesData[i] = a;
      } else {
        this.aeronavesData.push(a);
      }
      dialogRef.close();
      this.markComplete(['declaraciones', this.activeDeclId, 'paso8'], 'paso8');
    }
  }

  eliminarAeronave(a: Aeronave): void {
    this.aeronavesData = this.aeronavesData.filter(x => x !== a);
    if (this.tieneAeronaves === 'si' && this.aeronavesData.length === 0) {
      this.markIncomplete(['declaraciones', this.activeDeclId, 'paso8'], 'paso8');
    }
  }

  onTieneAeronavesChange(value: string): void {
    this.tieneAeronaves = value;
    if (value === 'no') {
      this.markIncomplete(['declaraciones', this.activeDeclId, 'paso8'], 'paso8');
    }
  }

  // ─── Naves ─────────────────────────────────────────────────────────────────

  openAddNaveModal(): void {
    this.editNave = false;
    this.currentNave = null;
    this.buildNaveForm();
    this.dialog.open(this.naveModal, { width: '800px' });
  }

  openEditNaveModal(item: Nave): void {
    this.editNave = true;
    this.currentNave = item;
    this.buildNaveForm(item);
    this.dialog.open(this.naveModal, { width: '800px' });
  }

  buildNaveForm(item?: Nave): void {
    this.naveForm = this.fb.group({
      tipo: [item?.tipo || 'Lancha', Validators.required],
      registro: [item?.registro || '', Validators.required],
      anio: [item?.anio || new Date().getFullYear(), [Validators.required, Validators.min(1900)]],
      valor: [item?.valor || 0, [Validators.required, Validators.min(0)]]
    });
  }

  saveNave(dialogRef: any): void {
    if (this.naveForm.valid) {
      const n = this.naveForm.value as Nave;
      if (this.editNave && this.currentNave) {
        const i = this.navesData.indexOf(this.currentNave);
        if (i >= 0) this.navesData[i] = n;
      } else {
        this.navesData.push(n);
      }
      dialogRef.close();
      this.markComplete(['declaraciones', this.activeDeclId, 'paso8'], 'paso8');
    }
  }

  eliminarNave(n: Nave): void {
    this.navesData = this.navesData.filter(x => x !== n);
    if (this.tieneNaves === 'si' && this.navesData.length === 0) {
      this.markIncomplete(['declaraciones', this.activeDeclId, 'paso8'], 'paso8');
    }
  }

  onTieneNavesChange(value: string): void {
    this.tieneNaves = value;
    if (value === 'no') {
      this.markIncomplete(['declaraciones', this.activeDeclId, 'paso8'], 'paso8');
    }
  }

  // ─── Otros Bienes ─────────────────────────────────────────────────────────

  openAddOtroBienModal(): void {
    this.editOtroBien = false;
    this.currentOtroBien = null;
    this.buildOtroBienForm();
    this.dialog.open(this.otroBienModal, { width: '800px' });
  }

  openEditOtroBienModal(item: OtroBien): void {
    this.editOtroBien = true;
    this.currentOtroBien = item;
    this.buildOtroBienForm(item);
    this.dialog.open(this.otroBienModal, { width: '800px' });
  }

  buildOtroBienForm(item?: OtroBien): void {
    this.otroBienForm = this.fb.group({
      tipo: [item?.tipo || 'Otro', Validators.required],
      descripcion: [item?.descripcion || '', Validators.required],
      valor: [item?.valor || 0, [Validators.required, Validators.min(0)]]
    });
  }

  saveOtroBien(dialogRef: any): void {
    if (this.otroBienForm.valid) {
      const o = this.otroBienForm.value as OtroBien;
      if (this.editOtroBien && this.currentOtroBien) {
        const i = this.otrosBienesData.indexOf(this.currentOtroBien);
        if (i >= 0) this.otrosBienesData[i] = o;
      } else {
        this.otrosBienesData.push(o);
      }
      dialogRef.close();
      this.markComplete(['declaraciones', this.activeDeclId, 'paso8'], 'paso8');
    }
  }

  eliminarOtroBien(o: OtroBien): void {
    this.otrosBienesData = this.otrosBienesData.filter(x => x !== o);
    if (this.tieneOtrosBienes === 'si' && this.otrosBienesData.length === 0) {
      this.markIncomplete(['declaraciones', this.activeDeclId, 'paso8'], 'paso8');
    }
  }

  onTieneOtrosBienesChange(value: string): void {
    this.tieneOtrosBienes = value;
    if (value === 'no') {
      this.markIncomplete(['declaraciones', this.activeDeclId, 'paso8'], 'paso8');
    }
  }

  // ─── Helpers para marcar paso ─────────────────────────────────────────────

  private markComplete(path: string[], key: string): void {
    this.validador.markComplete(key);
    this.stepperState.markStepCompleted(path);
  }

  private markIncomplete(path: string[], key: string): void {
    this.validador.markIncomplete(key);
    this.stepperState.markStepIncomplete(path);
  }
}
