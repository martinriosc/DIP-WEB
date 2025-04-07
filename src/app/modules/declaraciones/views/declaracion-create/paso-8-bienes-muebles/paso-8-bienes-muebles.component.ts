import { Component, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ValidadorDeclaracionService } from '../../../services/validador-declaracion.service';

// ======= Interfaces =======

// 1) Vehículos Motorizados
interface Vehiculo {
  tipo: string;      // "Liviano" o "Pesado"
  marca: string;
  modelo: string;
  anio: number;
  patente: string;
  valor: number;
}

// 2) Aeronaves
interface Aeronave {
  tipo: string;      // "Avión", "Helicóptero", etc.
  marca: string;
  modelo: string;
  anio: number;
  matricula: string;
  valor: number;
}

// 3) Naves o Artefactos Navales
interface Nave {
  tipo: string;      // "Lancha", "Yate", "Otro"
  registro: string;  // registro/matrícula naval
  anio: number;
  valor: number;
}

// 4) Otros bienes muebles registrados
interface OtroBien {
  tipo: string;      // "Maquinaria", "Remolque", "Otro"
  descripcion: string;
  valor: number;
}

@Component({
  selector: 'app-paso-8-bienes-muebles',
  templateUrl: './paso-8-bienes-muebles.component.html',
  styleUrls: ['./paso-8-bienes-muebles.component.scss']
})
export class Paso8BienesMueblesComponent {

  // Radios de cada subsección
  tieneVehiculos = 'no';
  tieneAeronaves = 'no';
  tieneNaves = 'no';
  tieneOtrosBienes = 'no';

  // 1) Vehículos Data + Modal
  vehiculosData: Vehiculo[] = [
    {
      tipo: 'Liviano',
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2019,
      patente: 'XX-1234',
      valor: 8000000
    }
  ];
  @ViewChild('vehiculoModal') vehiculoModal!: TemplateRef<any>;
  vehiculoForm!: FormGroup;
  editVehiculo = false;
  currentVehiculo: Vehiculo | null = null;

  // 2) Aeronaves Data + Modal
  aeronavesData: Aeronave[] = [];
  @ViewChild('aeronaveModal') aeronaveModal!: TemplateRef<any>;
  aeronaveForm!: FormGroup;
  editAeronave = false;
  currentAeronave: Aeronave | null = null;

  // 3) Naves Data + Modal
  navesData: Nave[] = [];
  @ViewChild('naveModal') naveModal!: TemplateRef<any>;
  naveForm!: FormGroup;
  editNave = false;
  currentNave: Nave | null = null;

  // 4) Otros bienes Data + Modal
  otrosBienesData: OtroBien[] = [];
  @ViewChild('otroBienModal') otroBienModal!: TemplateRef<any>;
  otroBienForm!: FormGroup;
  editOtroBien = false;
  currentOtroBien: OtroBien | null = null;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private validadorDeclaracionService: ValidadorDeclaracionService
  ) {}

  // ===========================================================================
  //  1) Vehículos Motorizados
  // ===========================================================================
  openAddVehiculoModal() {
    this.editVehiculo = false;
    this.currentVehiculo = null;
    this.buildVehiculoForm();
    this.dialog.open(this.vehiculoModal);
  }

  openEditVehiculoModal(item: Vehiculo) {
    this.editVehiculo = true;
    this.currentVehiculo = item;
    this.buildVehiculoForm(item);
    this.dialog.open(this.vehiculoModal);
  }

  buildVehiculoForm(item?: Vehiculo) {
    this.vehiculoForm = this.fb.group({
      tipo: [item?.tipo || 'Liviano', Validators.required],
      marca: [item?.marca || '', Validators.required],
      modelo: [item?.modelo || '', Validators.required],
      anio: [item?.anio || 2023, [Validators.required, Validators.min(1900)]],
      patente: [item?.patente || ''],
      valor: [item?.valor || 0, [Validators.required, Validators.min(0)]]
    });
  }

  saveVehiculo(dialogRef: any) {
    if (this.vehiculoForm.valid) {
      const formValue = this.vehiculoForm.value as Vehiculo;
      if (this.editVehiculo && this.currentVehiculo) {
        const i = this.vehiculosData.indexOf(this.currentVehiculo);
        if (i >= 0) {
          this.vehiculosData[i] = formValue;
        }
      } else {
        this.vehiculosData.push(formValue);
      }
      dialogRef.close();
      this.validadorDeclaracionService.setPasoCompleto('paso8', true);
    }
  }

  eliminarVehiculo(v: Vehiculo) {
    this.vehiculosData = this.vehiculosData.filter(x => x !== v);
  }

  onTieneVehiculosChange(value: string) {
    this.tieneVehiculos = value;
    if (value === 'no') {
      this.validadorDeclaracionService.setPasoCompleto('paso8', false);
    }
  }

  // ===========================================================================
  //  2) Aeronaves
  // ===========================================================================
  openAddAeronaveModal() {
    this.editAeronave = false;
    this.currentAeronave = null;
    this.buildAeronaveForm();
    this.dialog.open(this.aeronaveModal);
  }

  openEditAeronaveModal(item: Aeronave) {
    this.editAeronave = true;
    this.currentAeronave = item;
    this.buildAeronaveForm(item);
    this.dialog.open(this.aeronaveModal);
  }

  buildAeronaveForm(item?: Aeronave) {
    this.aeronaveForm = this.fb.group({
      tipo: [item?.tipo || 'Avión', Validators.required],
      marca: [item?.marca || '', Validators.required],
      modelo: [item?.modelo || '', Validators.required],
      anio: [item?.anio || 2023, [Validators.required, Validators.min(1900)]],
      matricula: [item?.matricula || ''],
      valor: [item?.valor || 0, [Validators.required, Validators.min(0)]]
    });
  }

  saveAeronave(dialogRef: any) {
    if (this.aeronaveForm.valid) {
      const formValue = this.aeronaveForm.value as Aeronave;
      if (this.editAeronave && this.currentAeronave) {
        const i = this.aeronavesData.indexOf(this.currentAeronave);
        if (i >= 0) {
          this.aeronavesData[i] = formValue;
        }
      } else {
        this.aeronavesData.push(formValue);
      }
      dialogRef.close();
      this.validadorDeclaracionService.setPasoCompleto('paso8', true);
    }
  }

  eliminarAeronave(a: Aeronave) {
    this.aeronavesData = this.aeronavesData.filter(x => x !== a);
  }

  onTieneAeronavesChange(value: string) {
    this.tieneAeronaves = value;
    if (value === 'no') {
      this.validadorDeclaracionService.setPasoCompleto('paso8', false);
    }
  }

  // ===========================================================================
  //  3) Naves o Artefactos Navales
  // ===========================================================================
  openAddNaveModal() {
    this.editNave = false;
    this.currentNave = null;
    this.buildNaveForm();
    this.dialog.open(this.naveModal);
  }

  openEditNaveModal(item: Nave) {
    this.editNave = true;
    this.currentNave = item;
    this.buildNaveForm(item);
    this.dialog.open(this.naveModal);
  }

  buildNaveForm(item?: Nave) {
    this.naveForm = this.fb.group({
      tipo: [item?.tipo || 'Lancha', Validators.required],
      registro: [item?.registro || '', Validators.required],
      anio: [item?.anio || 2023, [Validators.required, Validators.min(1900)]],
      valor: [item?.valor || 0, [Validators.required, Validators.min(0)]]
    });
  }

  saveNave(dialogRef: any) {
    if (this.naveForm.valid) {
      const formValue = this.naveForm.value as Nave;
      if (this.editNave && this.currentNave) {
        const i = this.navesData.indexOf(this.currentNave);
        if (i >= 0) {
          this.navesData[i] = formValue;
        }
      } else {
        this.navesData.push(formValue);
      }
      dialogRef.close();
      this.validadorDeclaracionService.setPasoCompleto('paso8', true);
    }
  }

  eliminarNave(n: Nave) {
    this.navesData = this.navesData.filter(x => x !== n);
  }

  onTieneNavesChange(value: string) {
    this.tieneNaves = value;
    if (value === 'no') {
      this.validadorDeclaracionService.setPasoCompleto('paso8', false);
    }
  }

  // ===========================================================================
  //  4) Otros bienes muebles registrados
  // ===========================================================================
  openAddOtroBienModal() {
    this.editOtroBien = false;
    this.currentOtroBien = null;
    this.buildOtroBienForm();
    this.dialog.open(this.otroBienModal);
  }

  openEditOtroBienModal(item: OtroBien) {
    this.editOtroBien = true;
    this.currentOtroBien = item;
    this.buildOtroBienForm(item);
    this.dialog.open(this.otroBienModal);
  }

  buildOtroBienForm(item?: OtroBien) {
    this.otroBienForm = this.fb.group({
      tipo: [item?.tipo || 'Otro', Validators.required],
      descripcion: [item?.descripcion || '', Validators.required],
      valor: [item?.valor || 0, [Validators.required, Validators.min(0)]]
    });
  }

  saveOtroBien(dialogRef: any) {
    if (this.otroBienForm.valid) {
      const formValue = this.otroBienForm.value as OtroBien;
      if (this.editOtroBien && this.currentOtroBien) {
        const i = this.otrosBienesData.indexOf(this.currentOtroBien);
        if (i >= 0) {
          this.otrosBienesData[i] = formValue;
        }
      } else {
        this.otrosBienesData.push(formValue);
      }
      dialogRef.close();
      this.validadorDeclaracionService.setPasoCompleto('paso8', true);
    }
  }

  eliminarOtroBien(o: OtroBien) {
    this.otrosBienesData = this.otrosBienesData.filter(x => x !== o);
  }

  onTieneOtrosBienesChange(value: string) {
    this.tieneOtrosBienes = value;
    if (value === 'no') {
      this.validadorDeclaracionService.setPasoCompleto('paso8', false);
    }
  }
}
