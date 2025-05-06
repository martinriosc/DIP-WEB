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
import { StepperStatusService } from 'src/app/modules/declaraciones/services/stepper-status.service';
import { ContratoService } from 'src/app/modules/declaraciones/services/contrato.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';

interface MandatoEspecial {
  tipo: string;
  descripcion: string;
  fecha: string;
  notaria: string;
  mandatario: string;
  estado: string;
}

@Component({
  selector: 'app-paso-12-mandato-especial',
  standalone: false,
  templateUrl: './paso-12-mandato-especial.component.html',
  styleUrls: ['./paso-12-mandato-especial.component.scss']
})
export class Paso12MandatoEspecialComponent implements OnInit {
  @ViewChild('mandatoModal') mandatoModal!: TemplateRef<any>;

  tieneMandato = 'no';
  mandatoForm!: FormGroup;
  editMode = false;
  currentItem: MandatoEspecial | null = null;
  dialogRef: MatDialogRef<any> | null = null;

  private activeDeclId!: string;
  contratos: any[] = [];

  declaracionId: number = 1319527;    //1319527
  declaranteId: number = 2882000;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private validador: ValidadorDeclaracionService,
    private stepperState: StepperStatusService,
    private _contratos: ContratoService,
    private _declaracionHelper: DeclaracionHelperService,
  ) { }

  ngOnInit(): void {
    // inicializamos el formulario
    this.buildForm();
    // obtenemos el id de la declaración activa
    this.stepperState.activeId$.subscribe(id => this.activeDeclId = id);
    this.loadContratos()
  }

  ngAfterViewInit(): void {
    this.loadRegistro();
  }

  
  loadRegistro(){
    this._declaracionHelper.declaracionesFlag$.subscribe(data => {
      console.log(data)
      this.tieneMandato = data.contratos ? 'si' : 'no';
    })
  }

  loadContratos() {
    this._contratos.listar(this.declaranteId).subscribe({
      next: (res: any) => {
        console.log(res)
        this.contratos = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  /** Maneja Guardar/Siguiente */
  onSubmit(): void {
    // const ok =
    //   this.tieneMandato === 'no' ||
    //   (this.tieneMandato === 'si' && this.mandatosData.length > 0);

    // const key = 'paso12';
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

  /** Cambia el radio "¿Tiene mandato?" */
  onTieneMandatoChange(value: string): void {
    this.tieneMandato = value;
    // const key = 'paso12';
    // const path = ['declaraciones', this.activeDeclId, key];
    // if (value === 'no') {
    //   // paso aplica por omisión
    //   this.validador.markComplete(key);
    //   this.stepperState.markStepCompleted(path);
    // } else {
    //   // aplica solo si hay datos
    //   if (this.mandatosData.length > 0) {
    //     this.validador.markComplete(key);
    //     this.stepperState.markStepCompleted(path);
    //   } else {
    //     this.validador.markIncomplete(key);
    //     this.stepperState.markStepIncomplete(path);
    //   }
    // }
  }

  /** Abre modal para agregar nuevo mandato */
  openAddModal(): void {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.dialogRef = this.dialog.open(this.mandatoModal, { width: '800px' });
  }

  /** Abre modal para editar mandato existente */
  openEditModal(item: MandatoEspecial): void {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.dialogRef = this.dialog.open(this.mandatoModal, { width: '800px' });
  }

  /** Inicializa o reinicia el formulario */
  private buildForm(item?: MandatoEspecial): void {
    this.mandatoForm = this.fb.group({
      tipo: [item?.tipo || ''],
      descripcion: [item?.descripcion || ''],
      fecha: [item?.fecha || ''],
      notaria: [item?.notaria || ''],
      mandatario: [item?.mandatario || ''],
      estado: [item?.estado || 'Activo']
    });
  }

  /** Guarda o actualiza un mandato */
  saveMandato(dialogRef: any): void {
    const key = 'paso12';
    const path = ['declaraciones', this.activeDeclId, key];

    if (this.mandatoForm.invalid) {
      this.validador.markIncomplete(key);
      this.stepperState.markStepIncomplete(path);
      return;
    }

    const m = this.mandatoForm.value as MandatoEspecial;
    if (this.editMode && this.currentItem) {
      const idx = this.contratos.indexOf(this.currentItem);
      if (idx >= 0) this.contratos[idx] = m;
    } else {
      this.contratos.push(m);
    }
    dialogRef.close();

    // Marca completo si hay al menos uno
    this.validador.markComplete(key);
    this.stepperState.markStepCompleted(path);
  }

  /** Elimina un mandato */
  eliminarMandato(item: MandatoEspecial): void {
    // const key = 'paso12';
    // const path = ['declaraciones', this.activeDeclId, key];

    // this.mandatosData = this.mandatosData.filter(x => x !== item);
    // if (this.mandatosData.length > 0) {
    //   this.validador.markComplete(key);
    //   this.stepperState.markStepCompleted(path);
    // } else {
    //   this.validador.markIncomplete(key);
    //   this.stepperState.markStepIncomplete(path);
    // }
  }
}
