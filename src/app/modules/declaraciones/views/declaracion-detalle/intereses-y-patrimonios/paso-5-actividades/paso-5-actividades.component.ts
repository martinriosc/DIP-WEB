import { Component, ViewChild, TemplateRef, Optional, SkipSelf } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ValidadorDeclaracionService } from '../../../../services/validador-declaracion.service';
import { MatStepper } from '@angular/material/stepper';
import { StepperStatusService } from 'src/app/modules/declaraciones/services/stepper-status.service';
import { ActividadProfesional } from 'src/app/shared/models/AllModels';
import { ActividadProfesionalService } from 'src/app/modules/declaraciones/services/actividad-profesional.service';
import { ComunService } from 'src/app/modules/declaraciones/services/comun.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';

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
  displayedColumnActividad12Meses: string[] = ['tipoActividad', 'rubroArea', 'vinculo', 'objetoEntidad', 'dataSensible', 'estado', 'acciones'];
  @ViewChild('actividad12MesesModal') actividad12MesesModal!: TemplateRef<any>;
  actividades12MesesForm!: FormGroup;
  edit12MesesMode = false;
  current12MesesItem: any | null = null;
  actividades12Meses: any[] = [];



  actividadesQueRealiza = 'no';
  displayedColumnsActividadesRealiza: string[] = ['tipoActividad', 'rubroArea', 'vinculo', 'objetoVinculo', 'fechaInicio', 'beneficiario', 'dataSensible', 'estado', 'acciones'];
  @ViewChild('actividadesRealizaModal') actividadesRealizaModal!: TemplateRef<any>;
  actividadesRealizaForm!: FormGroup;
  editRealizaMode = false;
  currentRealizaItem: any | null = null;
  actividadesRealiza: any[] = [];


  flagConyuge: boolean = false;
  actividadesConyuge = 'no';
  displayedColumnsActividadesConyuge: string[] = ['tipoActividad', 'rubroArea', 'fechaInicio', 'clasificacion', 'beneficiario', 'rutBeneficiario', 'dataSensible', 'estado', 'acciones'];
  @ViewChild('actividadesConyugeModal') actividadesConyugeModal!: TemplateRef<any>;
  actividadesConyugeForm!: FormGroup;
  editConyugeMode = false;
  currentConyugeItem: any | null = null;
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
    private _declaracionHelper: DeclaracionHelperService,
    private _actividad: ActividadProfesionalService,
    private _comun: ComunService,
    @Optional() @SkipSelf() private stepper?: MatStepper
  ) { }


  ngOnInit(): void {
    this.buildForm('12meses');
    this.buildForm('realiza');
    this.buildForm('conyuge');
    this.stepperState.activeId$.subscribe(id => this.activeDeclId = id);

    this.loadTipoActivdad();
    this.loadActividadesProfesionales();
    this.loadClasificaciones();

    this.validarConygue()
    this.loadActividades();

  }

  ngAfterViewInit(): void {
    this.loadRegistro();
  }


  loadRegistro() {
    this._declaracionHelper.declaracionesFlag$.subscribe(data => {
      console.log(data)
      this.actividadesUltimos12Meses = data.actividadesIndividuales ? 'si' : 'no';
      this.actividadesQueRealiza = data.actividadesGremiales ? 'si' : 'no';
      this.actividadesConyuge = data.actividadesDependiente ? 'si' : 'no';
    })
  }


  private buildForm(tipo: string,item?: any): void {
    if(tipo == '12meses'){
      this.actividades12MesesForm = this.fb.group({
        tipoActividad: [item?.tipoActividad || '', Validators.required],
        rubroArea: [item?.rubroArea || '', Validators.required],
        descripcion: [item?.vinculo || '', Validators.required],
        datoSensible: [item?.datoSensible || 'false', Validators.required]
      });
    } else if(tipo == 'realiza'){
      this.actividadesRealizaForm = this.fb.group({
        tipoActividad: [item?.tipoActividad || '', Validators.required],
        rubroArea: [item?.rubroArea || '', Validators.required],
        fechaInicio: [item?.fechaInicio || '', Validators.required],
        clasificacion: [item?.clasificacion || '', Validators.required],
        beneficiario: [item?.razonSocial || '', Validators.required],
        rutOrun: [item?.rutOrun || '', Validators.required],
        rutBeneficiario: [item?.rutBeneficiario || '', Validators.required],
        datoSensible: [item?.datoSensible || 'false', Validators.required]
      });
    } else if(tipo == 'conyuge'){
      this.actividadesConyugeForm = this.fb.group({
        tipoActividad: [item?.tipoActividad || '', Validators.required],
        rubroArea: [item?.rubroArea || '', Validators.required],
        fechaInicio: [item?.fechaInicio || '', Validators.required],
        clasificacion: [item?.clasificacion || '', Validators.required],
        beneficiario: [item?.razonSocial || '', Validators.required],
        rutOrun: [item?.rutOrun || '', Validators.required],
        rutBeneficiario: [item?.rutBeneficiario || '', Validators.required],
        datoSensible: [item?.datoSensible || 'false', Validators.required]
      });
    }
   

  }


  validarConygue() {
    this._actividad.validarConyuge(this.declaracionId).subscribe({
      next: (res: any) => {
        this.flagConyuge = res;
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

  openAddModal(tipo: string): void {
    if(tipo == '12meses'){
      this.edit12MesesMode = false;
      this.current12MesesItem = null;
      this.buildForm('12meses');
      this.dialog.open(this.actividad12MesesModal, { width: '800px' });
    } else if(tipo == 'realiza'){
      this.editRealizaMode = false;
      this.currentRealizaItem = null;
      this.buildForm('realiza');
      this.dialog.open(this.actividadesRealizaModal, { width: '800px' });
    } else if(tipo == 'conyuge'){
      this.editConyugeMode = false;
      this.currentConyugeItem = null;
      this.buildForm('conyuge');
      this.dialog.open(this.actividadesConyugeModal, { width: '800px' });
    }
   
  }

  openEditModal(tipo: string, item: any): void {
    if(tipo == '12meses'){
      this.edit12MesesMode = true;
      this.current12MesesItem = item;
      this.buildForm('12meses',item);
      this.dialog.open(this.actividad12MesesModal, { width: '800px' });
    } else if(tipo == 'realiza'){
      this.editRealizaMode = true;
      this.currentRealizaItem = item;
      this.buildForm('realiza',item);
      this.dialog.open(this.actividadesRealizaModal, { width: '800px' });
    } else if(tipo == 'conyuge'){
      this.editConyugeMode = true;
      this.currentConyugeItem = item;
      this.buildForm('conyuge',item);
      this.dialog.open(this.actividadesConyugeModal, { width: '800px' });
    }
  }

  saveActividad(tipo: string, dialogRef: any): void {
    if(tipo == '12meses'){
      const formValue = this.actividades12MesesForm.value as any;
      if(this.edit12MesesMode && this.current12MesesItem){
        const i = this.actividades12Meses.indexOf(this.current12MesesItem);
        if(i >= 0) this.actividades12Meses[i] = formValue;
      } else {
        this.actividades12Meses.push(formValue);
      }
      dialogRef.close();
      this.validadorDeclaracionService.markComplete('paso5');
      this.stepperState.markStepCompleted(['declaraciones', this.activeDeclId, 'paso5']);
        
      } else if(tipo == 'realiza'){
        const formValue = this.actividadesRealizaForm.value as any;
        if(this.editRealizaMode && this.currentRealizaItem){
          const i = this.actividadesRealiza.indexOf(this.currentRealizaItem);
          if(i >= 0) this.actividadesRealiza[i] = formValue;
        } else {
          this.actividadesRealiza.push(formValue);
        }
        dialogRef.close();
        this.validadorDeclaracionService.markComplete('paso5');
        this.stepperState.markStepCompleted(['declaraciones', this.activeDeclId, 'paso5']);
      } else if(tipo == 'conyuge'){
        const formValue = this.actividadesConyugeForm.value as any;
        if(this.editConyugeMode && this.currentConyugeItem){
          const i = this.actividadesConyugeData.indexOf(this.currentConyugeItem);
          if(i >= 0) this.actividadesConyugeData[i] = formValue;
        } else {
          this.actividadesConyugeData.push(formValue);
        }
        dialogRef.close();
        this.validadorDeclaracionService.markComplete('paso5');
        this.stepperState.markStepCompleted(['declaraciones', this.activeDeclId, 'paso5']);
    }
  }

  eliminarActividad(item: any): void {
    if(confirm(`¿Eliminar la actividad "${item.nombre}"?`)) {
      if(item.tipo == '12meses'){
        this.actividades12Meses = this.actividades12Meses.filter(a => a.id !== item.id);
        
      } else if(item.tipo == 'realiza'){
        this.actividadesRealiza = this.actividadesRealiza.filter(a => a.id !== item.id);
      } else if(item.tipo == 'conyuge'){
        this.actividadesConyugeData = this.actividadesConyugeData.filter(a => a.id !== item.id);
      }
    }

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
