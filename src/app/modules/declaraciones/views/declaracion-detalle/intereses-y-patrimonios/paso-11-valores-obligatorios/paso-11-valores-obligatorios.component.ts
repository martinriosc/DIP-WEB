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
import { MatDialog } from '@angular/material/dialog';

import { ValidadorDeclaracionService } from '../../../../services/validador-declaracion.service';
import { StepperStatusService }        from 'src/app/modules/declaraciones/services/stepper-status.service';
import { ValoresObligatoriosService } from 'src/app/modules/declaraciones/services/valores-obligatorios.service';
import { LocalidadService } from 'src/app/modules/declaraciones/services/localidad.service';
import { MonedaService } from 'src/app/modules/declaraciones/services/moneda.service';
import { InmuebleService } from 'src/app/modules/declaraciones/services/inmueble.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';

interface ValorObligatorio {
  tipoDocumento: string;
  nroDocumento:  string;
  valor:         number;
  fechaEmision:  string;
}

@Component({
  selector: 'app-paso-11-valores-obligatorios',
  standalone: false,
  templateUrl: './paso-11-valores-obligatorios.component.html',
  styleUrls: ['./paso-11-valores-obligatorios.component.scss']
})
export class Paso11ValoresObligatoriosComponent implements OnInit {
  @ViewChild('valObligModal') valObligModal!: TemplateRef<any>;

  tieneValoresObligatorios = 'no';
  valoresObligatoriosData: ValorObligatorio[] = [
    { tipoDocumento: 'PAGARE', nroDocumento: 'ABC-123', valor: 500000, fechaEmision: '2023-01-10' }
  ];
  valorForm!: FormGroup;
  editMode = false;
  currentItem: ValorObligatorio | null = null;

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
    private validador: ValidadorDeclaracionService,
    private stepperState: StepperStatusService,
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
    this.stepperState.activeId$.subscribe(id => this.activeDeclId = id);

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
      console.log(data)
      this.tieneCuentasLibretas = data.cuentas ? 'si' : 'no';
      this.tieneAhorrosPrevisionales = data.ahorros ? 'si' : 'no';
      this.tieneDepositosPlazo = data.depositos ? 'si' : 'no';
      this.tieneSeguros = data.seguros ? 'si' : 'no';
    })
  }


  loadValores(){
    this._valoresObligatorios.listar(this.declaranteId, 1).subscribe({
      next: (res: any) => {
        console.log(res)
        this.cuentasLibretas = res;
      },
      error: (err) => {
        console.log(err);
      }
    })

    this._valoresObligatorios.listar(this.declaranteId, 2).subscribe({
      next: (res: any) => {
        console.log(res)
        this.ahorrosPrevisionales = res;
      },
      error: (err) => {
        console.log(err);
      }
    })

    this._valoresObligatorios.listar(this.declaranteId, 3).subscribe({
      next: (res: any) => {
        console.log(res)
        this.depositosPlazo = res;
      },
      error: (err) => {
        console.log(err);
      }
    })

    this._valoresObligatorios.listar(this.declaranteId, 4).subscribe({
      next: (res: any) => {
        console.log(res)
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
        console.log(res)
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
        console.log(res)
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
        console.log(res)
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
        console.log(res)
        this.gravamenes = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  /** Maneja el click Guardar/Siguiente */
  onSubmit(): void {
    const ok =
      this.tieneValoresObligatorios === 'no' ||
      (this.tieneValoresObligatorios === 'si' && this.valoresObligatoriosData.length > 0);

    const key  = 'paso11';
    const path = ['declaraciones', this.activeDeclId, key];

    if (ok) {
      this.validador.markComplete(key);
      this.stepperState.markStepCompleted(path);
      this.stepperState.nextStep();
    } else {
      this.validador.markIncomplete(key);
      this.stepperState.markStepIncomplete(path);
    }
  }

  /** Abre modal para agregar nuevo documento */
  openAddModal(): void {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.dialog.open(this.valObligModal, { width: '800px' });
  }

  /** Abre modal para editar registro existente */
  openEditModal(item: ValorObligatorio): void {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.dialog.open(this.valObligModal, { width: '800px' });
  }

  /** Construye o reinicia el formulario de la modal */
  private buildForm(item?: ValorObligatorio): void {
    this.valorForm = this.fb.group({
      tipoDocumento: [item?.tipoDocumento || 'PAGARE', Validators.required],
      nroDocumento:  [item?.nroDocumento  || '',        Validators.required],
      valor:         [item?.valor         || 0,         [Validators.required, Validators.min(0)]],
      fechaEmision:  [item?.fechaEmision  || '',        Validators.required]
    });
  }

  /** Guarda o actualiza un registro desde la modal */
  saveValorOblig(dialogRef: any): void {
    const key  = 'paso11';
    const path = ['declaraciones', this.activeDeclId, key];

    if (this.valorForm.invalid) {
      this.validador.markIncomplete(key);
      this.stepperState.markStepIncomplete(path);
      return;
    }

    const data = this.valorForm.value as ValorObligatorio;
    if (this.editMode && this.currentItem) {
      const idx = this.valoresObligatoriosData.indexOf(this.currentItem);
      if (idx >= 0) this.valoresObligatoriosData[idx] = data;
    } else {
      this.valoresObligatoriosData.push(data);
    }

    // marca completo si hay al menos un registro
    this.validador.markComplete(key);
    this.stepperState.markStepCompleted(path);

    dialogRef.close();
  }

  /** Elimina un registro */
  eliminarValorOblig(item: ValorObligatorio): void {
    const key  = 'paso11';
    const path = ['declaraciones', this.activeDeclId, key];

    this.valoresObligatoriosData = this.valoresObligatoriosData.filter(x => x !== item);
    if (this.valoresObligatoriosData.length > 0) {
      this.validador.markComplete(key);
      this.stepperState.markStepCompleted(path);
    } else {
      this.validador.markIncomplete(key);
      this.stepperState.markStepIncomplete(path);
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

