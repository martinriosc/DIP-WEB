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
import { ComunidadValoresService } from 'src/app/modules/declaraciones/services/comunidad-valores.service';
import { InmuebleService } from 'src/app/modules/declaraciones/services/inmueble.service';
import { LocalidadService } from 'src/app/modules/declaraciones/services/localidad.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';

export interface DerechoAccion {
  titulo: string;
  tipoCantidadPorcentaje: 'Cantidad' | 'Porcentaje';
  cantidadPorcentaje: number;
  razonSocial: string;
  rut: string;
  giro: string;
  fechaAdquisicion: string;
  tipoValor: 'Valor corriente' | 'Valor libro';
  valor: number;
  gravamenes: string;
  controlador: boolean;
}

@Component({
  selector: 'app-paso-9-derechos-acciones',
  standalone: false,
  templateUrl: './paso-9-derechos-acciones.component.html',
  styleUrls: ['./paso-9-derechos-acciones.component.scss']
})
export class Paso9DerechosAccionesComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  derechosAcciones: DerechoAccion[] = [];
  formDerechoAccion!: FormGroup;
  dialogRef: MatDialogRef<any> | null = null;
  isEditing = false;
  editIndex: number | null = null;

  private activeDeclId!: string;

  tieneDerechosChile = 'no';
  tieneDerechosExtranjero = 'no';

  derechosAccionesChile: any[] = [];
  derechosAccionesExtranjero: any[] = [];
  titulos: any[] = [];
  gravamenes: any[] = [];
  paises: any[] = [];

  declaracionId: number = 0;
  declaranteId: number = 0;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private validador: ValidadorDeclaracionService,
    private stepperState: StepperStatusService,
    private _comunidad: ComunidadValoresService,
    private _inmueble: InmuebleService,
    private _localidad: LocalidadService,
    private _declaracionHelper: DeclaracionHelperService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.stepperState.activeId$.subscribe(id => this.activeDeclId = id);
    const path = ['declaraciones', this.activeDeclId, 'paso9'];
    this.validador.markIncomplete('paso9');
    this.stepperState.markStepIncomplete(path);

    this.loadDerechosOAcciones();
    this.loadTitulos();
    this.loadPaises();
  }


  ngAfterViewInit(): void {
    this.loadRegistro();
  }

  
  loadRegistro(){
    this._declaracionHelper.declaracionesFlag$.subscribe(data => {
      console.log(data)
      this.tieneDerechosChile = data.sociedades ? 'si' : 'no';
      this.tieneDerechosExtranjero = data.sociedadesExtranjero ? 'si' : 'no';
    })
  }

  loadDerechosOAcciones(){

    this._comunidad.listar(1,this.declaranteId,false).subscribe({
      next: (res: any) => {
        console.log(res)
        this.derechosAccionesChile = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
    
    this._comunidad.listar(1,this.declaranteId,true).subscribe({
      next: (res: any) => {
        console.log(res)
        this.derechosAccionesExtranjero = res;
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

  loadDegravamen(tipoGravamen: string){
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

  onTieneDerechosChileChange(event: any) {
    console.log(event);
    this.tieneDerechosChile = event;
  }

  onTieneDerechosExtranjeroChange(event: any) {
    this.tieneDerechosExtranjero = event;
  }




  /** crea o reinicia el form */
  private initForm(item?: DerechoAccion): void {
    this.formDerechoAccion = this.fb.group({
      titulo                 : [item?.titulo || '',                Validators.required],
      tipoCantidadPorcentaje : [item?.tipoCantidadPorcentaje || 'Cantidad', Validators.required],
      cantidadPorcentaje     : [item?.cantidadPorcentaje || '',     [Validators.required, Validators.pattern('^[0-9]+$')]],
      razonSocial            : [item?.razonSocial || '',           Validators.required],
      rut                    : [item?.rut || '',                   Validators.required],
      giro                   : [item?.giro || ''],
      fechaAdquisicion       : [item?.fechaAdquisicion || ''],
      tipoValor              : [item?.tipoValor || 'Valor corriente', Validators.required],
      valor                  : [item?.valor || '',                 [Validators.required, Validators.pattern('^[0-9]+$')]],
      gravamenes             : [item?.gravamenes || ''],
      controlador            : [item?.controlador ?? false,        Validators.required]
    });
  }

  /** abre dialog para agregar o editar */
  openDialog(item?: DerechoAccion, index?: number): void {
    if (item && index !== undefined) {
      this.isEditing = true;
      this.editIndex = index;
      this.initForm(item);
    } else {
      this.isEditing = false;
      this.editIndex = null;
      this.initForm();
    }
    this.dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '800px',
      disableClose: true
    });
  }

  /** cierra dialog */
  closeDialog(): void {
    this.dialogRef?.close();
  }

  /** guarda o actualiza un registro */
  saveDialog(): void {
    const path = ['declaraciones', this.activeDeclId, 'paso9'];
    if (this.formDerechoAccion.invalid) {
      this.validador.markIncomplete('paso9');
      this.stepperState.markStepIncomplete(path);
      return;
    }

    const data = this.formDerechoAccion.value as DerechoAccion;
    if (this.isEditing && this.editIndex !== null) {
      this.derechosAcciones[this.editIndex] = data;
    } else {
      this.derechosAcciones.push(data);
    }

    // si hay al menos uno, marcamos completo
    const ok = this.derechosAcciones.length > 0;
    if (ok) {
      this.validador.markComplete('paso9');
      this.stepperState.markStepCompleted(path);
    } else {
      this.validador.markIncomplete('paso9');
      this.stepperState.markStepIncomplete(path);
    }

    this.closeDialog();
  }

  /** elimina un ítem */
  deleteItem(index: number): void {
    const path = ['declaraciones', this.activeDeclId, 'paso9'];
    this.derechosAcciones.splice(index, 1);
    const ok = this.derechosAcciones.length > 0;
    if (ok) {
      this.validador.markComplete('paso9');
      this.stepperState.markStepCompleted(path);
    } else {
      this.validador.markIncomplete('paso9');
      this.stepperState.markStepIncomplete(path);
    }
  }

  /** guarda y avanza al siguiente paso */
  onSubmit(): void {
    const path = ['declaraciones', this.activeDeclId, 'paso9'];
    // asumimos válido si al menos hay uno o la lógica que estimes
    const ok = this.derechosAcciones.length > 0;
    if (ok) {
      this.validador.markComplete('paso9');
      this.stepperState.markStepCompleted(path);
      this.stepperState.nextStep();
    } else {
      this.validador.markIncomplete('paso9');
      this.stepperState.markStepIncomplete(path);
    }
  }
}
