import { Component, ViewChild, TemplateRef, Optional, SkipSelf } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ValidadorDeclaracionService } from '../../../../services/validador-declaracion.service';
import { MatStepper } from '@angular/material/stepper';
import { StepperStatusService } from 'src/app/modules/declaraciones/services/stepper-status.service';
import { ActividadProfesional } from 'src/app/shared/models/AllModels';
import { ActividadProfesionalService } from 'src/app/modules/declaraciones/services/actividad-profesional.service';
import { ComunService } from 'src/app/modules/declaraciones/services/comun.service';

interface ActividadItem {
  tipoActividad: string;
  rubroArea: string;
  vinculo: string;
}

@Component({
  selector: 'app-paso-5-actividades',
  standalone: false,
  templateUrl: './paso-5-actividades.component.html',
  styleUrls: ['./paso-5-actividades.component.scss']
})
export class Paso5ActividadesComponent {
  actividadesUltimos12Meses = 'no';
  actividadesQueRealiza = 'no';

  flagConyuge: boolean = false;
  actividadesConyuge = 'no';

  actividadesData: ActividadItem[] = [];
  displayedColumnActividad12Meses: string[] = ['tipoActividad', 'rubroArea', 'vinculo', 'objetoEntidad', 'dataSensible', 'estado', 'acciones'];
  displayedColumnsActividadesRealiza: string[] = ['tipoActividad', 'rubroArea', 'vinculo', 'objetoVinculo', 'fechaInicio', 'beneficiario', 'dataSensible', 'estado', 'acciones'];
  displayedColumnsActividadesConyuge: string[] = ['tipoActividad', 'rubroArea', 'fechaInicio', 'clasificacion', 'beneficiario', 'rutBeneficiario', 'dataSensible', 'estado', 'acciones'];

  @ViewChild('actividadModal') actividadModal!: TemplateRef<any>;
  actividadForm!: FormGroup;
  editMode = false;
  currentItem: ActividadItem | null = null;

  actividades12Meses: any[] = [];
  actividadesRealiza: any[] = [];
  actividadesConyugeData: any[] = [];

  tiposActividades: any[] = [];
  actividadesProfesionales: any[] = [];
  clasificaciones: any[] = [];

  declaracionId: number = 1319527;
  declaranteId: number = 2882000;

  private activeDeclId!: string;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private stepperState: StepperStatusService,
    private validadorDeclaracionService: ValidadorDeclaracionService,
    private _actividad: ActividadProfesionalService,
    private _comun: ComunService,
    @Optional() @SkipSelf() private stepper?: MatStepper
  ) { }


  ngOnInit(): void {
    this.buildForm();
    this.stepperState.activeId$.subscribe(id => this.activeDeclId = id);

    this.loadTipoActivdad();
    this.loadActividadesProfesionales();
    this.loadClasificaciones();

    this.validarConygue()
    this.loadActividades();
  }


  private buildForm(item?: ActividadItem): void {
    this.actividadForm = this.fb.group({
      tipoActividad: [item?.tipoActividad || 'ECONOMICA', Validators.required],
      rubroArea: [item?.rubroArea || '', Validators.required],
      vinculo: [item?.vinculo || '', Validators.required]
    });
  }


  validarConygue() {
    this._actividad.validarConyuge(this.declaracionId).subscribe({
      next: (res: any) => {
        this.flagConyuge = res;
        this.actividadesConyuge = res ? 'si' : 'no';
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadActividades() {
    this._actividad.listarActividades(1, this.declaranteId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          this.actividadesUltimos12Meses = 'si';
          this.actividades12Meses = res;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })

    this._actividad.listarActividades(2, this.declaranteId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          this.actividadesQueRealiza = 'si';
          this.actividadesRealiza = res;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })

    this._actividad.listarActividades(3, this.declaranteId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          this.actividadesConyuge = 'si';
          this.actividadesConyugeData = res;

        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadTipoActivdad() {
    this._comun.listarEntity('', 'TipoActividad').subscribe({
      next: (res: any) => {
        this.tiposActividades = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadActividadesProfesionales() {
    this._actividad.listar("", "tipo").subscribe({
      next: (res: any) => {
        this.actividadesProfesionales = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadClasificaciones() {
    this._actividad.listar("", "clasificacion").subscribe({
      next: (res: any) => {
        this.clasificaciones = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }



  onSubmit(): void {

  }

  openAddModal(): void {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.dialog.open(this.actividadModal, { width: '800px' });
  }

  openEditModal(item: ActividadItem): void {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.dialog.open(this.actividadModal, { width: '800px' });
  }

  saveActividad(dialogRef: any): void {
    if (this.actividadForm.valid) {
      const formValue = this.actividadForm.value as ActividadItem;
      if (this.editMode && this.currentItem) {
        const i = this.actividadesData.indexOf(this.currentItem);
        if (i >= 0) this.actividadesData[i] = formValue;
      } else {
        this.actividadesData.push(formValue);
      }
      dialogRef.close();
      this.validadorDeclaracionService.markComplete('paso5');
      this.stepperState.markStepCompleted(['declaraciones', this.activeDeclId, 'paso5']);
    }
  }

  eliminarActividad(item: ActividadItem): void {

  }

  onTieneActividad12MesesChange(value: string): void {
    this.actividadesUltimos12Meses = value;

  }

  onTieneActividadRealizaChange(value: string): void {
    this.actividadesQueRealiza = value;

  }

  onTieneActividadConyugeChange(value: string): void {
    this.actividadesConyuge = value;

  }
}
