import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, ElementRef, TemplateRef, Type, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Step } from '../../models/Step';
import { StepperStatusService } from '../../services/stepper-status.service';
import { Paso1DeclaracionComponent } from '../../views/declaracion-detalle/antecedentes-declarante/paso-1-declaracion/paso-1-declaracion.component';
import { Paso2DatosPersonalesComponent } from '../../views/declaracion-detalle/antecedentes-declarante/paso-2-datos-personales/paso-2-datos-personales.component';
import { Paso3EntidadComponent } from '../../views/declaracion-detalle/antecedentes-declarante/paso-3-entidad/paso-3-entidad.component';
import { Paso4TutelaComponent } from '../../views/declaracion-detalle/antecedentes-declarante/paso-4-tutela/paso-4-tutela.component';
import { Paso10ValoresComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-10-valores/paso-10-valores.component';
import { Paso11ValoresObligatoriosComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-11-valores-obligatorios/paso-11-valores-obligatorios.component';
import { Paso12MandatoEspecialComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-12-mandato-especial/paso-12-mandato-especial.component';
import { Paso13PasivosComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-13-pasivos/paso-13-pasivos.component';
import { Paso14FuenteConflictoComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-14-fuente-conflicto/paso-14-fuente-conflicto.component';
import { Paso15OtrosBienesComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-15-otros-bienes/paso-15-otros-bienes.component';
import { Paso16AntecedentesComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-16-antecedentes/paso-16-antecedentes.component';
import { Paso5ActividadesComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-5-actividades/paso-5-actividades.component';
import { Paso6BienesInmueblesComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-6-bienes-inmuebles/paso-6-bienes-inmuebles.component';
import { Paso7DerechosAguasComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-7-derechos-aguas/paso-7-derechos-aguas.component';
import { Paso8BienesMueblesComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-8-bienes-muebles/paso-8-bienes-muebles.component';
import { Paso9DerechosAccionesComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-9-derechos-acciones/paso-9-derechos-acciones.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';

const COMPONENT_MAP: Record<string, Type<unknown>> = {
  'Paso1DeclaracionComponent': Paso1DeclaracionComponent,
  'Paso2DatosPersonalesComponent': Paso2DatosPersonalesComponent,
  'Paso3EntidadComponent': Paso3EntidadComponent,
  'Paso4TutelaComponent': Paso4TutelaComponent,
  'Paso5ActividadesComponent': Paso5ActividadesComponent,
  'Paso6BienesInmueblesComponent': Paso6BienesInmueblesComponent,
  'Paso7DerechosAguasComponent': Paso7DerechosAguasComponent,
  'Paso8BienesMueblesComponent': Paso8BienesMueblesComponent,
  'Paso9DerechosAccionesComponent': Paso9DerechosAccionesComponent,
  'Paso10ValoresComponent': Paso10ValoresComponent,
  'Paso11ValoresObligatoriosComponent': Paso11ValoresObligatoriosComponent,
  'Paso12MandatoEspecialComponent': Paso12MandatoEspecialComponent,
  'Paso13PasivosComponent': Paso13PasivosComponent,
  'Paso14FuenteConflictoComponent': Paso14FuenteConflictoComponent,
  'Paso15OtrosBienesComponent': Paso15OtrosBienesComponent,
  'Paso16AntecedentesComponent': Paso16AntecedentesComponent
}

@Component({
  selector: 'app-dip-stepper',
  standalone: false,
  templateUrl: './dip-stepper.component.html',
  styleUrls: ['./dip-stepper.component.scss']
})
export class DipStepperComponent {
  @ViewChild('declaracionModal') declaracionModal!: TemplateRef<any>;
  editMode = false;
  currentItem: any | null = null;

  selectedTabIndex = 0;           // ⬅️ estado de pestaña activa

  declaraciones$ = this.state.declaraciones$;
  activeId$ = this.state.activeId$;
  globalProgress$ = this.state.globalProgress$;
  showDeclarantesModal = false;


  declSteps$ = this.state.declaranteSteps$;
  intSteps$ = this.state.interesesSteps$;

  declProgress$ = this.state.declProgress$;
  intProgress$ = this.state.intProgress$;

  declSteps: Step[] = [];
  intSteps: Step[] = [];

  declIndex = 0;
  intIndex = -1;
  activeComponent: Type<unknown> | null = null;

  @ViewChild('declStepper', { static: true }) declStepper!: MatStepper;
  @ViewChild('intStepper', { static: true }) intStepper!: MatStepper;
  @ViewChild('declContainer', { static: true, read: ElementRef }) declContainer!: ElementRef<HTMLElement>;
  @ViewChild('intContainer', { static: true, read: ElementRef }) intContainer!: ElementRef<HTMLElement>;

  constructor(
    private readonly state: StepperStatusService,
    private dialog: MatDialog
  ) {
    this.state.declaranteSteps$.subscribe(a => this.declSteps = a);
    this.state.interesesSteps$.subscribe(a => this.intSteps = a);
  }


  ngAfterViewInit() {
    this.loadDeclStep(0);
    this.attachHeaderClicks();
    // this.state.setActiveBlock('decl');

  }


  ngOnInit(): void {

        this.state.nextStep$.subscribe(() => {
      if (this.declIndex >= 0) {
        this.declStepper.next();
      } else if (this.intIndex >= 0) {
        this.intStepper.next();
      }
    });
    this.state.block$.subscribe(block => {
      if (block === 'decl') {
        this.declStepper.selectedIndex = 0;
        this.handleDeclChange({ selectedIndex: 0 } as StepperSelectionEvent);
      } else {
        this.intStepper.selectedIndex = 0;
        this.handleIntChange({ selectedIndex: 0 } as StepperSelectionEvent);
      }
    });
  }


  onTabChange(ev: MatTabChangeEvent): void {
    this.selectedTabIndex = ev.index;

    switch (ev.index) {
      case 0: // ─── Antecedentes del declarante ───
        this.state.setActiveBlock('decl');
        this.declStepper.selectedIndex = 0;
        this.handleDeclChange({ selectedIndex: 0 } as StepperSelectionEvent);
        break;

      case 1: // ─── Intereses y patrimonios ───
        this.state.setActiveBlock('int');
        this.intStepper.selectedIndex = 0;
        this.handleIntChange({ selectedIndex: 0 } as StepperSelectionEvent);
        break;

      default: // ─── Confirmación de datos ───
        this.activeComponent = null;               // oculta componente activo
        this.declIndex = this.intIndex = -1;       // resetea índices
        break;
    }
  }

  openAddModal() {
    this.editMode = false;
    this.dialog.open(this.declaracionModal, { width: '850px' });
  }

  /** Abrir modal para Editar */
  openEditModal(item: any) {
    this.editMode = true;
    this.currentItem = item;
    this.dialog.open(this.declaracionModal, { width: '850px' });
  }

  openDeclarantesModal(): void {
    this.showDeclarantesModal = true;
  }

  closeDeclarantesModal(): void {
    this.showDeclarantesModal = false;
  }

  selectDeclarante(id: string): void {
    this.state.setActiveDeclaracion(id);
    this.closeDeclarantesModal();
    this.intIndex = 0;
    this.loadStep('int', this.intIndex);
  }

  loadStep(type: 'decl' | 'int', index: number): void {
    const step = type === 'decl' ? this.declSteps[index] : this.intSteps[index];
    this.activeComponent = COMPONENT_MAP[step.component!];
  }


  change(id: string) { this.state.setActiveDeclaracion(id); }

  handleDeclChange(ev: StepperSelectionEvent) {
    this.declIndex = ev.selectedIndex;
    this.activeComponent = COMPONENT_MAP[this.declSteps[this.declIndex].component!]!;
    // des‑selecciona intereses
    this.intStepper.selectedIndex = -1;
    this.intIndex = -1;
  }

  handleIntChange(ev: StepperSelectionEvent) {
    this.intIndex = ev.selectedIndex;
    this.activeComponent = COMPONENT_MAP[this.intSteps[this.intIndex].component!]!;
    // des‑selecciona declarante
    this.declStepper.selectedIndex = -1;
    this.declIndex = -1;
  }

  private loadDeclStep(i: number) {
    const key = this.declSteps[i]?.component!;
    this.activeComponent = COMPONENT_MAP[key] ?? null;
  }
  private loadIntStep(i: number) {
    const key = this.intSteps[i]?.component!;
    this.activeComponent = COMPONENT_MAP[key] ?? null;
  }

  private attachHeaderClicks() {
    // DECLARANTE
    const declHeaders = this.declContainer.nativeElement
      .querySelectorAll<HTMLElement>('.mat-step-header');
    const declEl = this.declContainer?.nativeElement;
    if (!declEl) { return; }
    declHeaders.forEach((hdr, idx) => {
      hdr.style.cursor = 'pointer';
      hdr.addEventListener('click', () => {
        if (this.declIndex === idx) {
          this.loadDeclStep(idx);
        } else {
          this.declStepper.selectedIndex = idx;
        }
      });
    });

    // INTERESES
    const intHeaders = this.intContainer.nativeElement
      .querySelectorAll<HTMLElement>('.mat-step-header');
    const intEl = this.intContainer?.nativeElement;
    if (!intEl) { return; }
    intHeaders.forEach((hdr, idx) => {
      hdr.style.cursor = 'pointer';
      hdr.addEventListener('click', () => {
        if (this.intIndex === idx) {
          this.loadIntStep(idx);
        } else {
          this.intStepper.selectedIndex = idx;
        }
      });
    });
  }


  /** helpers para iconos */
  getDeclStatus(idx: number): Step['status'] {
    return this.declSteps[idx]?.status ?? 'pending';
  }
  getIntStatus(idx: number): Step['status'] {
    return this.intSteps[idx]?.status ?? 'pending';
  }

  private center(container: ElementRef<HTMLElement>) {
    const el = container.nativeElement
      .querySelector<HTMLElement>('.mat-step-header.mat-active');
    el?.scrollIntoView({ inline: 'center', behavior: 'smooth' });
  }
}
