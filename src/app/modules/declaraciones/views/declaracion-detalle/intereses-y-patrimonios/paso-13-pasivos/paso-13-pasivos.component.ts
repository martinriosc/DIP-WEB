import { ServicioService } from '../../../../services/servicio.service';
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
import { PasivosService } from 'src/app/modules/declaraciones/services/pasivos.service';
import { PensionesService } from 'src/app/modules/declaraciones/services/pensiones.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';

interface PasivoItem {
  tipoPasivo:        string;
  institucion:       string;
  monto:             number;
  fechaAdquisicion:  string;
}

@Component({
  selector: 'app-paso-13-pasivos',
  standalone: false,
  templateUrl: './paso-13-pasivos.component.html',
  styleUrls: ['./paso-13-pasivos.component.scss']
})
export class Paso13PasivosComponent implements OnInit {
  @ViewChild('pasivoModal') pasivoModal!: TemplateRef<any>;

  tienePasivos    = 'no';
  tieneDeudaPension = 'no';
  pasivosData: PasivoItem[] = [
    { tipoPasivo: 'CREDITO', institucion: 'Banco ABC', monto: 2000000, fechaAdquisicion: '15/03/2023' }
  ];

  pasivoForm!: FormGroup;
  editMode = false;
  currentItem: PasivoItem | null = null;
  dialogRef: MatDialogRef<any> | null = null;

  private activeDeclId!: string;

  montoGlobal: any;

  deduasPensionAlimento: any[] = [];
  deudasMayor100UTM: any[] = [];

  tipoObligacion: any[] = [];

  declaracionId: number = 1319527;    //1319527
  declaranteId: number = 2882000;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private validador: ValidadorDeclaracionService,
    private stepperState: StepperStatusService,
    private _pasivos: PasivosService,
    private _pensiones: PensionesService,
    private _servicioPublico: ServicioService,
    private _declaracionHelper: DeclaracionHelperService
  ) {}

  ngOnInit(): void {
    // Inicializa el formulario vacío
    this.buildForm();
    // Recupera el ID de la declaración activa
    this.stepperState.activeId$.subscribe(id => this.activeDeclId = id);

    this.loadDeudas();
    this.loadDeudasMayor100UTM();
    this.loadTipoObligacion();
  }


  ngAfterViewInit(): void {
    this.loadRegistro();
  }

  
  loadRegistro(){
    this._declaracionHelper.declaracionesFlag$.subscribe(data => {
      console.log(data)
      this.tienePasivos = data.pasivos ? 'si' : 'no';
      this.tieneDeudaPension = data.pensiones ? 'si' : 'no';
    })
  }

  loadDeudas(){
    this._pasivos.listar(this.declaranteId).subscribe({
      next: (res: any) => {
        console.log(res)
        this.deduasPensionAlimento = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadDeudasMayor100UTM(){
    this._pensiones.listar(this.declaranteId).subscribe({
      next: (res: any) => {
        console.log(res)
        this.deudasMayor100UTM = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  loadTipoObligacion(){
    this._servicioPublico.listarServiciosPublicos("tipoObligacion").subscribe({
      next: (res: any) => {
        console.log(res)
        this.tipoObligacion = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onTieneDeudaPensionChange(value: string): void {
    this.tieneDeudaPension = value;
  }
  onTienePasivosChange(value: string): void {
    this.tienePasivos = value;
 
  }

  /** Maneja Guardar/Siguiente */
  onSubmit(): void {
    const ok =
      this.tienePasivos === 'no' ||
      (this.tienePasivos === 'si' && this.pasivosData.length > 0);

    const key  = 'paso13';
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

  /** Radio “¿Tiene Pasivos?” */

  /** Abre modal para crear o editar */
  openAddModal(): void {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.dialogRef = this.dialog.open(this.pasivoModal, { width: '800px' });
  }

  openEditModal(item: PasivoItem): void {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.dialogRef = this.dialog.open(this.pasivoModal, { width: '800px' });
  }

  /** Construye o reinicia el formulario */
  private buildForm(item?: PasivoItem): void {
    this.pasivoForm = this.fb.group({
      tipoPasivo:       [item?.tipoPasivo       || 'CREDITO', Validators.required],
      institucion:      [item?.institucion      || '',         Validators.required],
      monto:            [item?.monto            || 0,          [Validators.required, Validators.min(1)]],
      fechaAdquisicion: [item?.fechaAdquisicion || '',         Validators.required]
    });
  }

  /** Guarda o actualiza tras cerrar modal */
  savePasivo(dialogRef: MatDialogRef<any>): void {
    const key  = 'paso13';
    const path = ['declaraciones', this.activeDeclId, key];

    if (this.pasivoForm.invalid) {
      this.validador.markIncomplete(key);
      this.stepperState.markStepIncomplete(path);
      return;
    }

    const data = this.pasivoForm.value as PasivoItem;
    if (this.editMode && this.currentItem) {
      const idx = this.pasivosData.indexOf(this.currentItem);
      if (idx >= 0) this.pasivosData[idx] = data;
    } else {
      this.pasivosData.push(data);
    }
    dialogRef.close();

    // Marca completo si hay al menos un pasivo
    this.validador.markComplete(key);
    this.stepperState.markStepCompleted(path);
  }

  /** Elimina un pasivo */
  eliminarPasivo(item: PasivoItem): void {
    const key  = 'paso13';
    const path = ['declaraciones', this.activeDeclId, key];

    this.pasivosData = this.pasivosData.filter(x => x !== item);
    if (this.pasivosData.length > 0) {
      this.validador.markComplete(key);
      this.stepperState.markStepCompleted(path);
    } else {
      this.validador.markIncomplete(key);
      this.stepperState.markStepIncomplete(path);
    }
  }
}
