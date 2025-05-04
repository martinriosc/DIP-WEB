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
import { ComunidadValoresService } from 'src/app/modules/declaraciones/services/comunidad-valores.service';
import { MonedaService } from 'src/app/modules/declaraciones/services/moneda.service';
import { InmuebleService } from 'src/app/modules/declaraciones/services/inmueble.service';
import { LocalidadService } from 'src/app/modules/declaraciones/services/localidad.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';

interface ValorItem {
  tipoValor:        string;
  emisor:           string;
  cantidad:         number;
  valorAproximado:  number;
}

@Component({
  selector: 'app-paso-10-valores',
  standalone: false,
  templateUrl: './paso-10-valores.component.html',
  styleUrls: ['./paso-10-valores.component.scss']
})
export class Paso10ValoresComponent implements OnInit {
  @ViewChild('valorModal') valorModal!: TemplateRef<any>;

  tieneValoresChile   = 'no';
  tieneValoresExtranjero = 'no';


  valorForm!: FormGroup;
  editMode = false;
  currentItem: ValorItem | null = null;

  private activeDeclId!: string;

  valoresChile: any[] = [];
  valoresExtranjero: any[] = [];
  titulos: any[] = [];
  monedas: any[] = [];
  gravamenes: any[] = [];
  paises: any[] = [];

  declaracionId: number = 1319527;    //1319527
  declaranteId: number = 2882000;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private validador: ValidadorDeclaracionService,
    private stepperState: StepperStatusService,
    private _comunidad: ComunidadValoresService,
    private _moneda : MonedaService,
    private _inmueble: InmuebleService,
    private _localidad: LocalidadService,
    private _declaracionHelper: DeclaracionHelperService
  ) {}

  ngOnInit(): void {
    // Construye el formulario vacío
    this.buildForm();
    // Obtiene la declaración activa
    this.stepperState.activeId$.subscribe(id => this.activeDeclId = id);

    this.loadValores();
    this.loadPaises();
    this.loadMonedas();
    // this.loadGravamenes();
    this.loadTitulos();
  }


  ngAfterViewInit(): void {
    this.loadRegistro();
  }

  
  loadRegistro(){
    this._declaracionHelper.declaracionesFlag$.subscribe(data => {
      console.log(data)
      this.tieneValoresChile = data.instrumento ? 'si' : 'no';
      this.tieneValoresExtranjero = data.instrumentoExtranjero ? 'si' : 'no';
    })
  }


  loadValores(){
    this._comunidad.listar(3,this.declaranteId,false).subscribe({
      next: (res: any) => {
        console.log(res)
        this.valoresChile = res;
      },
      error: (err) => {
        console.log(err);
      }
    })

    this._comunidad.listar(3,this.declaranteId,true).subscribe({
      next: (res: any) => {
        console.log(res)
        this.valoresExtranjero = res;
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

  loadTitulos(){
    this._comunidad.listarTitulos().subscribe({
      next: (res: any) => {
        console.log(res)
        this.titulos = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadGravamenes(tipoGravamen: string){
    this._inmueble.listarAtributos('degravamen', tipoGravamen).subscribe({
      next: (res: any) => {
        console.log(res)
        this.gravamenes = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  /** Guarda y avanza al siguiente paso */
  onSubmit(): void {
    // const ok =
    //   this.tieneValores === 'no' ||
    //   (this.tieneValores === 'si' && this.valoresData.length > 0);

    // const key  = 'paso10';
    // const path = ['declaraciones', this.activeDeclId, key];

    // if (ok) {
    //   this.validador.markComplete(key);
    //   this.stepperState.markStepCompleted(path);
    //   this.stepperState.nextStep();
    // } else {
    //   this.validador.markIncomplete(key);
    //   this.stepperState.markStepIncomplete(path);
    // }
  }

  /** Abre modal para agregar */
  openAddModal(): void {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.dialog.open(this.valorModal, { width: '800px' });
  }

  /** Abre modal para editar */
  openEditModal(item: ValorItem): void {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.dialog.open(this.valorModal, { width: '800px' });
  }

  /** Construye o resetea el formulario */
  private buildForm(item?: ValorItem): void {
    this.valorForm = this.fb.group({
      tipoValor:       [item?.tipoValor      || 'BONO', Validators.required],
      emisor:          [item?.emisor         || '',     Validators.required],
      cantidad:        [item?.cantidad       || 0,      [Validators.required, Validators.min(1)]],
      valorAproximado: [item?.valorAproximado || 0,      [Validators.required, Validators.min(0)]]
    });
  }

  /** Guarda o actualiza un valor desde la modal */
  saveValor(dialogRef: any): void {
    // const key  = 'paso10';
    // const path = ['declaraciones', this.activeDeclId, key];

    // if (this.valorForm.invalid) {
    //   this.validador.markIncomplete(key);
    //   this.stepperState.markStepIncomplete(path);
    //   return;
    // }

    // const v = this.valorForm.value as ValorItem;
    // if (this.editMode && this.currentItem) {
    //   const idx = this.valoresData.indexOf(this.currentItem);
    //   if (idx >= 0) this.valoresData[idx] = v;
    // } else {
    //   this.valoresData.push(v);
    // }
    // dialogRef.close();

    // // Marca completo si hay al menos uno
    // this.validador.markComplete(key);
    // this.stepperState.markStepCompleted(path);
  }

  /** Elimina un valor */
  eliminarValor(v: ValorItem): void {
    const key  = 'paso10';
    const path = ['declaraciones', this.activeDeclId, key];


  
  }

  onTieneValoresChileChange(value: string) {
    this.tieneValoresChile = value;

  }

  onTieneValoresExtranjeroChange(value: string) {
    this.tieneValoresExtranjero = value;
  }
}
