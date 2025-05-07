import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, ElementRef, TemplateRef, Type, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';

import { Step } from '../../models/Step';
import { StepperStatusService } from '../../services/stepper-status.service';

/* ────── Componentes de cada paso ────── */
import { Paso1DeclaracionComponent } from '../../views/declaracion-detalle/antecedentes-declarante/paso-1-declaracion/paso-1-declaracion.component';
import { Paso2DatosPersonalesComponent } from '../../views/declaracion-detalle/antecedentes-declarante/paso-2-datos-personales/paso-2-datos-personales.component';
import { Paso3EntidadComponent } from '../../views/declaracion-detalle/antecedentes-declarante/paso-3-entidad/paso-3-entidad.component';
import { Paso4TutelaComponent } from '../../views/declaracion-detalle/antecedentes-declarante/paso-4-tutela/paso-4-tutela.component';
import { Paso5ActividadesComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-5-actividades/paso-5-actividades.component';
import { Paso6BienesInmueblesComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-6-bienes-inmuebles/paso-6-bienes-inmuebles.component';
import { Paso7DerechosAguasComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-7-derechos-aguas/paso-7-derechos-aguas.component';
import { Paso8BienesMueblesComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-8-bienes-muebles/paso-8-bienes-muebles.component';
import { Paso9DerechosAccionesComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-9-derechos-acciones/paso-9-derechos-acciones.component';
import { Paso10ValoresComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-10-valores/paso-10-valores.component';
import { Paso11ValoresObligatoriosComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-11-valores-obligatorios/paso-11-valores-obligatorios.component';
import { Paso12MandatoEspecialComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-12-mandato-especial/paso-12-mandato-especial.component';
import { Paso13PasivosComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-13-pasivos/paso-13-pasivos.component';
import { Paso14FuenteConflictoComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-14-fuente-conflicto/paso-14-fuente-conflicto.component';
import { Paso15OtrosBienesComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-15-otros-bienes/paso-15-otros-bienes.component';
import { Paso16AntecedentesComponent } from '../../views/declaracion-detalle/intereses-y-patrimonios/paso-16-antecedentes/paso-16-antecedentes.component';
import { DeclaracionHelperService } from '../../services/declaracion-helper.service';
import { DeclaracionService } from '../../services/declaracion.service';
import { DeclaranteService } from '../../services/declarante.service';
import { DatosLaboralesService } from '../../services/datos-laborales.service';
import { PersonaRelacionadaService } from '../../services/persona-relacionada.service';

/* Mapa para instanciar dinámicamente el componente de cada paso */
const COMPONENT_MAP: Record<string, Type<unknown>> = {
  Paso1DeclaracionComponent,
  Paso2DatosPersonalesComponent,
  Paso3EntidadComponent,
  Paso4TutelaComponent,
  Paso5ActividadesComponent,
  Paso6BienesInmueblesComponent,
  Paso7DerechosAguasComponent,
  Paso8BienesMueblesComponent,
  Paso9DerechosAccionesComponent,
  Paso10ValoresComponent,
  Paso11ValoresObligatoriosComponent,
  Paso12MandatoEspecialComponent,
  Paso13PasivosComponent,
  Paso14FuenteConflictoComponent,
  Paso15OtrosBienesComponent,
  Paso16AntecedentesComponent
};

@Component({
  selector: 'app-dip-stepper',
  templateUrl: './dip-stepper.component.html',
  styleUrls: ['./dip-stepper.component.scss']
})
export class DipStepperComponent {

  @ViewChild('declaracionModal') declaracionModal!: TemplateRef<any>;
  @ViewChild('declStepper', { static: true }) declStepper!: MatStepper;
  @ViewChild('intStepper', { static: true }) intStepper!: MatStepper;
  @ViewChild('declContainer', { static: true, read: ElementRef }) declContainer!: ElementRef<HTMLElement>;
  @ViewChild('intContainer', { static: true, read: ElementRef }) intContainer!: ElementRef<HTMLElement>;


  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  private currentBlock: 'decl' | 'int' = 'decl';
  activeDeclName$: Observable<string> = this.state.activeDeclaranteName$;


  selectedTabIndex = 0;
  editMode = false;
  currentItem: any | null = null;

  /* ───── Streams (async pipes en template) ───── */
  declaraciones$ = this.state.declaraciones$;
  activeId$ = this.state.activeId$;
  globalProgress$ = this.state.globalProgress$;
  declProgress$ = this.state.declProgress$;
  intProgress$ = this.state.intProgress$;

  /* Copias para uso imperativo */
  declSteps: Step[] = [];
  intSteps: Step[] = [];

  declIndex = 0;
  intIndex = -1;
  activeComponent: Type<unknown> | null = null;
  showDeclarantesModal = false;

  declaracionId: number = 1319527;
  declaranteId: number = 2882000;

  /* ───── Interno ───── */
  private destroy$ = new Subject<void>();

  constructor(
    private readonly state: DeclaracionHelperService,
    private readonly dialog: MatDialog,
    private readonly cd: ChangeDetectorRef

  ) {
    this.state.declaranteSteps$
      .pipe(takeUntil(this.destroy$))
      .subscribe(s => { this.declSteps = s; this.cd.markForCheck(); });

    this.state.interesesSteps$
      .pipe(takeUntil(this.destroy$))
      .subscribe(s => { this.intSteps = s; this.cd.markForCheck(); });
  }

  /* ───────── Ciclo de vida ───────── */
  ngOnInit(): void {

    this.state.nextStep$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.advanceVisualStepper());

    this.state.block$
      .pipe(takeUntil(this.destroy$))
      .subscribe(b => this.resetToBlock(b));

    this.state.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.cd.markForCheck());

      this.state.currentStepKey$
      .pipe(takeUntil(this.destroy$))
      .subscribe(key => this.syncVisualStepper(key));
  }

  ngAfterViewInit(): void {
    this.loadDeclStep(0);
    this.attachHeaderClicks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private syncVisualStepper(key: string): void {

    if (this.currentBlock === 'decl') {
      const idx = this.declSteps.findIndex(s => s.key === key);
      if (idx >= 0 && this.declStepper.selectedIndex !== idx) {   // ← NUEVO
        this.declStepper.selectedIndex = idx;
        // no llamamos handleDeclChange porque selectionChange
        // se disparará automáticamente con el nuevo índice
      }
    } else {
      const idx = this.intSteps.findIndex(s => s.key === key);
      if (idx >= 0 && this.intStepper.selectedIndex !== idx) {    // ← NUEVO
        this.intStepper.selectedIndex = idx;
      }
    }
  }
  private advanceVisualStepper(): void {
    /* Sólo efectos visuales */
    if (this.currentBlock === 'decl') {
      this.center(this.declContainer);
    } else {
      this.center(this.intContainer);
    }
  }
  

  private resetToBlock(b: 'decl' | 'int'): void {
    this.currentBlock = b;
  
    /* ①  Cambiar mat‑tab de forma imperativa */
    const tabIndex = b === 'decl' ? 0 : 1;
    if (this.tabGroup && this.tabGroup.selectedIndex !== tabIndex) {
      this.tabGroup.selectedIndex = tabIndex;
      this.selectedTabIndex = tabIndex;
    }
  
    /* ②  Reposicionar el stepper correspondiente */
    if (b === 'decl') {
      this.declStepper.selectedIndex = 0;
      this.handleDeclChange({ selectedIndex: 0 } as StepperSelectionEvent);
    } else {
      this.intStepper.selectedIndex = 0;
      this.handleIntChange({ selectedIndex: 0 } as StepperSelectionEvent);
    }
  }

  /* ───────── Cambio de pestaña (mat‑tab) ───────── */
  onTabChange(ev: MatTabChangeEvent): void {
    this.selectedTabIndex = ev.index;

    switch (ev.index) {
      case 0:  // Antecedentes
        this.state.setActiveBlock('decl');
        this.declStepper.selectedIndex = 0;
        this.handleDeclChange({ selectedIndex: 0 } as StepperSelectionEvent);
        break;

      case 1:  // Intereses
        this.state.setActiveBlock('int');
        this.intStepper.selectedIndex = 0;
        this.handleIntChange({ selectedIndex: 0 } as StepperSelectionEvent);
        break;

      default: // Confirmación
        this.activeComponent = null;
        this.declIndex = this.intIndex = -1;
    }
  }

  /* ───────── Modal de declarantes ───────── */
  openAddModal(): void {
    this.editMode = false;
    this.dialog.open(this.declaracionModal, { width: '850px' });
  }
  openEditModal(item: any): void {
    this.editMode = true;
    this.currentItem = item;
    this.dialog.open(this.declaracionModal, { width: '850px' });
  }

  openDeclarantesModal(): void { this.showDeclarantesModal = true; }
  closeDeclarantesModal(): void { this.showDeclarantesModal = false; }

  selectDeclarante(id: string): void {
    this.state.setActiveDeclaracion(id);
    this.closeDeclarantesModal();
    this.intIndex = 0;
    this.loadStep('int', 0);
  }

  /* DECLARANTE */
handleDeclChange(ev: StepperSelectionEvent): void {
  this.declIndex = ev.selectedIndex;

  /* ①  usar la key REAL del paso, no calcularla a mano */
  const key = this.declSteps[this.declIndex].key;

  this.activeComponent = COMPONENT_MAP[this.declSteps[this.declIndex].component!];
  this.state.setCurrentStep(key);

  this.intStepper.selectedIndex = -1;
  this.intIndex = -1;
}
 /* INTERESES */
handleIntChange(ev: StepperSelectionEvent): void {
  this.intIndex = ev.selectedIndex;

  /* ②  idem para intereses */
  const key = this.intSteps[this.intIndex].key;

  this.state.setCurrentStep(key);
  this.activeComponent = COMPONENT_MAP[this.intSteps[this.intIndex].component!];

  this.declStepper.selectedIndex = -1;
  this.declIndex = -1;
}

  /* ───────── Helpers de carga ───────── */
  loadStep(type: 'decl' | 'int', idx: number): void {
    const step = type === 'decl' ? this.declSteps[idx] : this.intSteps[idx];
    this.activeComponent = COMPONENT_MAP[step.component!];
  }
  private loadDeclStep(i: number): void { this.loadStep('decl', i); }
  private loadIntStep(i: number): void { this.loadStep('int', i); }

  /* ───────── Click en cabeceras de stepper ───────── */
  private attachHeaderClicks(): void {
    /* DECLARANTE */
    this.declContainer.nativeElement
      .querySelectorAll<HTMLElement>('.mat-step-header')
      .forEach((hdr, idx) => {
        hdr.style.cursor = 'pointer';
        hdr.addEventListener('click', () => {
          if (this.declIndex === idx) { this.loadDeclStep(idx); }
          else { this.declStepper.selectedIndex = idx; }
        });
      });

    /* INTERESES */
    this.intContainer.nativeElement
      .querySelectorAll<HTMLElement>('.mat-step-header')
      .forEach((hdr, idx) => {
        hdr.style.cursor = 'pointer';
        hdr.addEventListener('click', () => {
          if (this.intIndex === idx) { this.loadIntStep(idx); }
          else { this.intStepper.selectedIndex = idx; }
        });
      });
  }

  /* ───────── Iconos de advertencia / check ───────── */
  getDeclStatus(i: number): Step['status'] { return this.declSteps[i]?.status ?? 'pending'; }
  getIntStatus(i: number): Step['status'] { return this.intSteps[i]?.status ?? 'pending'; }

  /* ───────── Centrar header activo ───────── */
  center(el: ElementRef<HTMLElement> | HTMLElement): void {
    const host = (el as ElementRef<HTMLElement>).nativeElement
      ? (el as ElementRef<HTMLElement>).nativeElement
      : el as HTMLElement;

    host.querySelector<HTMLElement>('.mat-step-header.mat-active')
      ?.scrollIntoView({ inline: 'center', behavior: 'smooth' });
  }
}
