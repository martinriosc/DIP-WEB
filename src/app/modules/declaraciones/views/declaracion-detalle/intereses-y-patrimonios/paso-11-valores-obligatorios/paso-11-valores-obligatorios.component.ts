import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ValidadorDeclaracionService } from '../../../../services/validador-declaracion.service';
import { StepperStatusService }        from 'src/app/modules/declaraciones/services/stepper-status.service';
import { ValoresObligatoriosService } from 'src/app/modules/declaraciones/services/valores-obligatorios.service';
import { LocalidadService } from 'src/app/modules/declaraciones/services/localidad.service';
import { MonedaService } from 'src/app/modules/declaraciones/services/moneda.service';
import { InmuebleService } from 'src/app/modules/declaraciones/services/inmueble.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';

interface ValorObligatorio {
  tipoDocumento: string;
  nroDocumento: string;
  montoTotal: number;
  registraInscripcion: string;
  estado: string;
  fechaEmision: string;
  tipoMoneda: string;
  pais: string;
}

@Component({
  selector: 'app-paso-11-valores-obligatorios',
  standalone: false,
  templateUrl: './paso-11-valores-obligatorios.component.html',
  styleUrls: ['./paso-11-valores-obligatorios.component.scss']
})
export class Paso11ValoresObligatoriosComponent implements OnInit {
  @ViewChild('cuentasModal') cuentasModal!: TemplateRef<any>;
  @ViewChild('ahorrosModal') ahorrosModal!: TemplateRef<any>;
  @ViewChild('depositosModal') depositosModal!: TemplateRef<any>;
  @ViewChild('segurosModal') segurosModal!: TemplateRef<any>;

  tieneValoresObligatorios = 'no';
  valoresObligatoriosData: ValorObligatorio[] = [
    { tipoDocumento: 'PAGARE', nroDocumento: 'ABC-123', montoTotal: 500000, registraInscripcion: 'SI', estado: 'Activo', fechaEmision: '2023-01-10', tipoMoneda: 'Peso', pais: 'Argentina' }
  ];
  valorForm!: FormGroup;
  editMode = false;
  currentItem: ValorObligatorio | null = null;
  dialogRef: MatDialogRef<any> | null = null;

  private activeDeclId!: string;

  tieneCuentasLibretas = 'no';
  tieneAhorrosPrevisionales = 'no';
  tieneDepositosPlazo = 'no';
  tieneSeguros = 'no';

  cuentasLibretas: any[] = [];
  ahorrosPrevisionales: any[] = [];
  depositosPlazo: any[] = [];
  seguros: any[] = [];

  tipoInstrumentos: any[] = [];
  paises: any[] = [];
  monedas: any[] = [];
  gravamenes: any[] = [];

  declaracionId: number = 1319527;    //1319527
  declaranteId: number = 2882000;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _valoresObligatorios: ValoresObligatoriosService,
    private _localidad: LocalidadService,
    private _moneda: MonedaService,
    private _inmueble: InmuebleService,
    private _declaracionHelper: DeclaracionHelperService
  ) {}

  ngOnInit(): void {
    // Construye el formulario inicial vacío
    this.buildForm();
    // Obtiene la declaración activa
    this._declaracionHelper.activeId$.subscribe(id => this.activeDeclId = id);

    this.loadValores();
    this.loadPaises();
    this.loadMonedas();
    // this.loadGravamenes();
    // this.loadTiposInstrumentos();
    
  }

  ngAfterViewInit(): void {
    this.loadRegistro();
  }

  
  loadRegistro(){
    this._declaracionHelper.declaracionesFlag$.subscribe(data => {
      
      this.tieneCuentasLibretas = data.cuentas ? 'si' : 'no';
      this.tieneAhorrosPrevisionales = data.ahorros ? 'si' : 'no';
      this.tieneDepositosPlazo = data.depositos ? 'si' : 'no';
      this.tieneSeguros = data.seguros ? 'si' : 'no';
    })
  }


  loadValores(){
    this._valoresObligatorios.listar(this.declaranteId, 1).subscribe({
      next: (res: any) => {
        
        this.cuentasLibretas = res;
      },
      error: (err) => {
        console.log(err);
      }
    })

    this._valoresObligatorios.listar(this.declaranteId, 2).subscribe({
      next: (res: any) => {
        
        this.ahorrosPrevisionales = res;
      },
      error: (err) => {
        console.log(err);
      }
    })

    this._valoresObligatorios.listar(this.declaranteId, 3).subscribe({
      next: (res: any) => {
        
        this.depositosPlazo = res;
      },
      error: (err) => {
        console.log(err);
      }
    })

    this._valoresObligatorios.listar(this.declaranteId, 4).subscribe({
      next: (res: any) => {
        
        this.seguros = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadTiposInstrumentos(tipoInstrumento: number){
    this._valoresObligatorios.listarTipoInstrumento(tipoInstrumento).subscribe({
      next: (res: any) => {
        
        this.tipoInstrumentos = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadPaises(){
    this._localidad.getPaisesExtranjeros().subscribe({
      next: (res: any) => {
        
        this.paises = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadMonedas(){
    this._moneda.listar().subscribe({
      next: (res: any) => {
        
        this.monedas = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadGravamen(tipoGravamen: string) {
    this._inmueble.listarAtributos('desgravamen', tipoGravamen).subscribe({
      next: (res: any) => {
        
        this.gravamenes = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  /** Maneja el click Guardar/Siguiente */
  onSubmit(): void {
    const ok1 = this.tieneCuentasLibretas === 'si' ? this.cuentasLibretas.length > 0 : true;
    const ok2 = this.tieneAhorrosPrevisionales === 'si' ? this.ahorrosPrevisionales.length > 0 : true;
    const ok3 = this.tieneDepositosPlazo === 'si' ? this.depositosPlazo.length > 0 : true;
    const ok4 = this.tieneSeguros === 'si' ? this.seguros.length > 0 : true;
    const ok = ok1 && ok2 && ok3 && ok4;
    if (ok) {
      this._declaracionHelper.markStepCompleted(['declaraciones', 'paso11']);
      this._declaracionHelper.nextStep();
    } else {
      this._declaracionHelper.markStepIncomplete(['declaraciones', 'paso11']);
      this._declaracionHelper.nextStep();
    }
  }

  /** Abre modal para agregar nueva cuenta/libreta */
  openAddCuentaModal(): void {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.loadTiposInstrumentos(1);
    this.dialogRef = this.dialog.open(this.cuentasModal, { width: '800px' });
  }

  /** Abre modal para editar cuenta/libreta existente */
  openEditCuentaModal(item: any): void {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.loadTiposInstrumentos(1);
    this.dialogRef = this.dialog.open(this.cuentasModal, { width: '800px' });
  }

  /** Abre modal para agregar nuevo ahorro previsional */
  openAddAhorroModal(): void {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.loadTiposInstrumentos(2);
    this.dialogRef = this.dialog.open(this.ahorrosModal, { width: '800px' });
  }

  /** Abre modal para editar ahorro previsional existente */
  openEditAhorroModal(item: any): void {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.loadTiposInstrumentos(2);
    this.dialogRef = this.dialog.open(this.ahorrosModal, { width: '800px' });
  }

  /** Abre modal para agregar nuevo depósito */
  openAddDepositoModal(): void {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.loadTiposInstrumentos(3);
    this.dialogRef = this.dialog.open(this.depositosModal, { width: '800px' });
  }

  /** Abre modal para editar depósito existente */
  openEditDepositoModal(item: any): void {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.loadTiposInstrumentos(3);
    this.dialogRef = this.dialog.open(this.depositosModal, { width: '800px' });
  }

  /** Abre modal para agregar nuevo seguro */
  openAddSeguroModal(): void {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.loadTiposInstrumentos(4);
    this.dialogRef = this.dialog.open(this.segurosModal, { width: '800px' });
  }

  /** Abre modal para editar seguro existente */
  openEditSeguroModal(item: any): void {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.loadTiposInstrumentos(4);
    this.dialogRef = this.dialog.open(this.segurosModal, { width: '800px' });
  }

  /** Construye o reinicia el formulario de la modal */
  private buildForm(item?: ValorObligatorio): void {
    this.valorForm = this.fb.group({
      tipoDocumento: [item?.tipoDocumento || 'PAGARE'],
      nroDocumento: [item?.nroDocumento || ''],
      montoTotal: [item?.montoTotal || 0, [Validators.min(0)]],
      registraInscripcion: [item?.registraInscripcion || ''],
      estado: [item?.estado || ''],
      fechaEmision: [item?.fechaEmision || ''],
      tipoMoneda: [item?.tipoMoneda || ''],
      pais: [item?.pais || '']
    });
  }

  /** Guarda o actualiza un registro desde la modal */
  saveValorOblig(dialogRef: any): void {
    const key  = 'paso11';
    const path = ['declaraciones', this.activeDeclId, key];

    if (this.valorForm.invalid) {
      this._declaracionHelper.markStepIncomplete(path);
      return;
    }

    const data = this.valorForm.value as ValorObligatorio;
    if (this.editMode && this.currentItem) {
      const idx = this.valoresObligatoriosData.indexOf(this.currentItem);
      if (idx >= 0) this.valoresObligatoriosData[idx] = data;
    } else {
      this.valoresObligatoriosData.push(data);
    }

    this._declaracionHelper.markStepCompleted(path);

    dialogRef.close();
  }

  /** Elimina un registro */
  eliminarValorOblig(item: ValorObligatorio): void {
    const key  = 'paso11';
    const path = ['declaraciones', this.activeDeclId, key];

    this.valoresObligatoriosData = this.valoresObligatoriosData.filter(x => x !== item);
    if (this.valoresObligatoriosData.length > 0) {
      this._declaracionHelper.markStepCompleted(path);
    } else {
      this._declaracionHelper.markStepIncomplete(path);
    }
  }

  onTieneCuentasLibretaChange(value: string): void {
    this.tieneCuentasLibretas = value;
  }

  onTieneAhorrosChange(value: string): void {
    this.tieneAhorrosPrevisionales = value;
  }

  onTieneDepositoAPlazoChange(value: string): void {
    this.tieneDepositosPlazo = value;
  }

  onTieneSeguroChange(value: string): void {
    this.tieneSeguros = value;
  }


}

