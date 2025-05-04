import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ValidadorDeclaracionService } from '../../../../services/validador-declaracion.service';
import { StepperStatusService } from 'src/app/modules/declaraciones/services/stepper-status.service';
import { AguasService } from 'src/app/modules/declaraciones/services/aguas.service';
import { LocalidadService } from 'src/app/modules/declaraciones/services/localidad.service';
import { ComunService } from 'src/app/modules/declaraciones/services/comun.service';

interface DerechoAgua {
  tipo: string;   // APROVECHAMIENTO, etc.
  rol: string;   // Rol o Identificador
  caudal: number;   // l/s
}

@Component({
  selector: 'app-paso-7-derechos-aguas',
  templateUrl: './paso-7-derechos-aguas.component.html',
  standalone: false,
  styleUrls: ['./paso-7-derechos-aguas.component.scss']
})
export class Paso7DerechosAguasComponent implements OnInit, AfterViewInit {
  tieneDerechosAguas = 'no';
  tieneConcesiones = 'no';
  derechosAguasData: any[] = [];
  concesionesData: any[] = [];
  @ViewChild('derechosAguasModal') derechosAguasModal!: TemplateRef<any>;
  derechosAguasForm!: FormGroup;
  editMode = false;
  currentItem: DerechoAgua | null = null;


  derechosAguasAprovechamiento: any[] = [];
  derechosAguasConcesion: any[] = [];

  entidadesEmisoras: any[] = [];
  tiposDerecho: any[] = [];
  naturalezaAgua: any[] = [];
  regiones: any[] = [];
  actos: any[] = [];
  serviciosEmisores: any[] = [];
  tipos: any[] = [];

  private activeDeclId!: string;

  declaracionId: number = 1319527;    //1319527
  declaranteId: number = 2882000;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private validador: ValidadorDeclaracionService,
    private stepperState: StepperStatusService,
    private _aguas: AguasService,
    private _localidad: LocalidadService,
    private _comun: ComunService
  ) { }

  ngOnInit(): void {
    this.stepperState.activeId$.subscribe(id => this.activeDeclId = id);
    this.buildForm();

    this.loadAguas();
    this.loadEntidadesEmisoras();
    this.loadTiposDerecho();
    this.loadNaturalezaAgua();
    this.loadRegiones();
    this.loadActos();
    this.loadServiciosEmisores();
    this.loadTipos();
  }


  loadAguas() {
    this._aguas.listar('aprovechamiento', this.declaranteId).subscribe({
      next: (response: any) => {
        console.log(response)
        if (response.length > 0) {
          this.tieneDerechosAguas = 'si';
          this.derechosAguasAprovechamiento = response;
        }
      },
      error: (error) => {
        console.error('Error al cargar derechos de agua:', error);
      }
    })

    this._aguas.listar('concesiones', this.declaranteId).subscribe({
      next: (response: any) => {
        console.log(response)

        if (response.length > 0) {
          this.tieneConcesiones = 'si';
          this.derechosAguasConcesion = response;

        }
      },
      error: (error) => {
        console.error('Error al cargar derechos de agua:', error);
      }
    })
  }

  loadEntidadesEmisoras() {
    this._aguas.listarEntidadesLike('').pipe().subscribe({
      next: (response: any) => {
        console.log(response)
        this.entidadesEmisoras = response;
      },
      error: (error) => {
        console.error('Error al cargar derechos de agua:', error);
      }
    })
  }

  loadTiposDerecho() {
    this._aguas.listarAtributos('tipoDerecho').pipe().subscribe({
      next: (response: any) => {
        console.log(response)
        this.tiposDerecho = response;
      },
      error: (error) => {
        console.error('Error al cargar derechos de agua:', error);
      }
    })
  }

  loadNaturalezaAgua() {
    this._aguas.listarNaturaleza().pipe().subscribe({
      next: (response: any) => {
        console.log(response)
        this.naturalezaAgua = response;
      },
      error: (error) => {
        console.error('Error al cargar derechos de agua:', error);
      }
    })
  }

  loadRegiones() {
    this._localidad.getRegiones().subscribe({
      next: (response: any) => {
        console.log(response)
        this.regiones = response;
      },
      error: (error) => {
        console.error('Error al cargar regiones:', error);
      }
    })
  }

  loadActos() {
    this._aguas.listarAtributos('actoAdministrativo').pipe().subscribe({
      next: (response: any) => {
        console.log(response)
        this.actos = response;
      },
      error: (error) => {
        console.error('Error al cargar actos:', error);
      }
    })
  }

  loadServiciosEmisores() {
    this._comun.listarEntity('', 'ServicioEmisor').pipe().subscribe({
      next: (response: any) => {
        console.log(response)
        this.serviciosEmisores = response;
      },
      error: (error) => {
        console.error('Error al cargar servicios emisores:', error);
      }
    })
  }

  loadTipos(){
    this._comun.listarEntity('', 'TipoConcesion').pipe().subscribe({
      next: (response: any) => {
        console.log(response)
        this.tipos = response;
      },
      error: (error) => {
        console.error('Error al cargar tipos:', error);
      }
    })
  }


  ngAfterViewInit(): void {
    // No necesitamos suscribir statusChanges aquí; validamos manualmente en onSubmit()
  }

  /** Guardar + avanzar */
  onSubmit(): void {
    const ok =
      (this.tieneDerechosAguas === 'si' && this.derechosAguasData.length > 0) ||
      this.tieneDerechosAguas === 'no';

    const key = 'paso7';
    const path = ['declaraciones', this.activeDeclId, key];

    if (ok) {
      this.validador.markComplete(key);
      this.stepperState.markStepCompleted(path);
      // Avanzar al siguiente paso
      this.stepperState.nextStep();
    } else {
      this.validador.markIncomplete(key);
      this.stepperState.markStepIncomplete(path);
    }
  }

  /** Abrir modal para agregar un nuevo derecho */
  openAddModal(): void {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.dialog.open(this.derechosAguasModal, { width: '800px' });
  }

  /** Abrir modal para editar un derecho existente */
  openEditModal(item: DerechoAgua): void {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.dialog.open(this.derechosAguasModal, { width: '800px' });
  }

  /** Construye o reinicia el formulario de la modal */
  private buildForm(item?: DerechoAgua): void {
    this.derechosAguasForm = this.fb.group({
      tipo: [item?.tipo || 'APROVECHAMIENTO', Validators.required],
      rol: [item?.rol || '', Validators.required],
      caudal: [item?.caudal || 0, Validators.required]
    });
  }

  /** Guarda el derecho tras cerrar la modal */
  saveDerecho(dialogRef: any): void {
    if (this.derechosAguasForm.valid) {
      const formValue = this.derechosAguasForm.value as DerechoAgua;
      if (this.editMode && this.currentItem) {
        const idx = this.derechosAguasData.indexOf(this.currentItem);
        if (idx >= 0) this.derechosAguasData[idx] = formValue;
      } else {
        this.derechosAguasData.push(formValue);
      }
      dialogRef.close();
      // Marca paso como completo ahora que hay al menos un registro
      const key = 'paso7';
      const path = ['declaraciones', this.activeDeclId, key];
      this.validador.markComplete(key);
      this.stepperState.markStepCompleted(path);
    }
  }

  /** Elimina un derecho existente */
  eliminarDerecho(item: DerechoAgua): void {
    this.derechosAguasData = this.derechosAguasData.filter(x => x !== item);
    // Si se quedaron sin datos y el usuario dijo que sí tenía derechos:
    if (this.tieneDerechosAguas === 'si' && this.derechosAguasData.length === 0) {
      const key = 'paso7';
      const path = ['declaraciones', this.activeDeclId, key];
      this.validador.markIncomplete(key);
      this.stepperState.markStepIncomplete(path);
    }
  }

  /** Maneja cambio en el radio “¿Tiene derechos de aguas?” */
  onTieneDerechosChange(value: string): void {
    this.tieneDerechosAguas = value;
    const key = 'paso7';
    const path = ['declaraciones', this.activeDeclId, key];
    if (value === 'no') {
      // Si no aplica, lo marcamos como completo automáticamente
      this.validador.markComplete(key);
      this.stepperState.markStepCompleted(path);
    }
  }

  onTieneConcesionesChange(value: string): void {
    this.tieneConcesiones = value;
    // const key = 'paso7';
    // const path = ['declaraciones', this.activeDeclId, key];
    // if (value === 'no') {
    //   // Si no aplica, lo marcamos como completo automáticamente
    //   this.validador.markComplete(key);
    //   this.stepperState.markStepCompleted(path);
    // }
  }
}
