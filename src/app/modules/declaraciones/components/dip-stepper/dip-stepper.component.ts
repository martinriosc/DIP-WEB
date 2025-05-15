import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, ElementRef, TemplateRef, Type, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { combineLatest, map, Observable, Subject, takeUntil, take, finalize } from 'rxjs';

import { Step } from '../../models/Step';

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
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

/* Mapa para instanciar dinámicamente el componente de cada paso */
const COMPONENT_MAP: Record<string, Type<unknown>> = {
  'Paso1DeclaracionComponent': Paso1DeclaracionComponent,
  'Paso2DatosPersonalesComponent': Paso2DatosPersonalesComponent,
  'Paso3EntidadComponent': Paso3EntidadComponent,
  'Paso4TutelaComponent': Paso4TutelaComponent,
  'Paso5Component': Paso5ActividadesComponent,
  'Paso6Component': Paso6BienesInmueblesComponent,
  'Paso7Component': Paso7DerechosAguasComponent,
  'Paso8Component': Paso8BienesMueblesComponent,
  'Paso9Component': Paso9DerechosAccionesComponent,
  'Paso10Component': Paso10ValoresComponent,
  'Paso11Component': Paso11ValoresObligatoriosComponent,
  'Paso12Component': Paso12MandatoEspecialComponent,
  'Paso13Component': Paso13PasivosComponent,
  'Paso14Component': Paso14FuenteConflictoComponent,
  'Paso15Component': Paso15OtrosBienesComponent,
  'Paso16Component': Paso16AntecedentesComponent
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

  isCreating: boolean = false;

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

  declaracionId: number = 0;
  declaranteId: number = 0;

  /* ───── Interno ───── */
  private destroy$ = new Subject<void>();

  isLoading: boolean = true;

  constructor(
    private readonly state: DeclaracionHelperService,
    private readonly dialog: MatDialog,
    private readonly cd: ChangeDetectorRef,
    private _auth: AuthService,
    private _spinner: NgxSpinnerService
  ) {
    // Por defecto, mostrar el loader
    this.isLoading = true;

    // Suscripción a los pasos del declarante
    this.state.declaranteSteps$
      .pipe(takeUntil(this.destroy$))
      .subscribe(s => {
        this.declSteps = s;
        this.cd.markForCheck();
      });

    // Suscripción a los pasos de intereses
    this.state.interesesSteps$
      .pipe(takeUntil(this.destroy$))
      .subscribe(s => {
        this.intSteps = s;
        // Solo actualizar el índice si estamos cambiando de pestaña o seleccionando un nuevo declarante
        if (this.selectedTabIndex === 1 && s.length > 0 && this.intIndex === -1) {
          setTimeout(() => {
            this.intStepper.selectedIndex = 0;
            this.handleIntChange({ selectedIndex: 0 } as StepperSelectionEvent);
          });
        }
        this.cd.markForCheck();
      });

    // Suscripción al estado isCreating para manejar nueva declaración
    this.state.isCreating$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isCreating => {
        console.log("isCreating suscripcion isCreating", this.isCreating)
        this.isCreating = isCreating;
        // Si es una nueva declaración, desactivamos el loader inmediatamente
        if (isCreating) {
          // this.isLoading = false;
          this.cd.detectChanges();
        }
      });

    // Suscripción al progreso global para controlar el loader
    this.globalProgress$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(progress => {
        console.log("isCreating suscripcion globalProgress", this.isCreating)
        // Solo manejamos el loader si NO es una nueva declaración
        if (!this.isCreating) {

          this.cd.detectChanges();
        }
      });
  }

  /* ───────── Ciclo de vida ───────── */
  ngOnInit(): void {
    // Inicializar loader como visible
    this.isLoading = true;
    this.cd.detectChanges();

    // Suscripción al estado isCreating
    this.state.isCreating$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isCreating => {
        this.isCreating = isCreating;
        // Si es una nueva declaración, desactivamos el loader
        if (isCreating) {
          this.cd.detectChanges();
        }
      });

    // Inicializar con el declarante principal
    this.state.initializeWithMainDeclarante();

    this.state.nextStep$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.advanceVisualStepper());

    this.state.block$
      .pipe(takeUntil(this.destroy$))
      .subscribe(b => this.resetToBlock(b));

    this.state.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (!this.isCreating) {
          this.validateAntecedentesProgress();
        }
        this.cd.markForCheck();
      });

    this.state.currentStepKey$
      .pipe(takeUntil(this.destroy$))
      .subscribe(key => this.syncVisualStepper(key));

    setTimeout(() => {
      this.isLoading = false
    }, 2500)
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
      if (idx >= 0 && this.declStepper.selectedIndex !== idx) {
        this.declStepper.selectedIndex = idx;
        this.declIndex = idx;
      }
    } else {
      const idx = this.intSteps.findIndex(s => s.key === key);
      if (idx >= 0 && this.intStepper.selectedIndex !== idx) {
        const step = this.intSteps[idx];
        if (step && step.enabled) {
          this.intStepper.selectedIndex = idx;
          this.intIndex = idx;

          const componentName = step.component;
          if (componentName && COMPONENT_MAP[componentName]) {
            this.activeComponent = COMPONENT_MAP[componentName];
          }
        }
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
      if (this.declSteps && this.declSteps.length > 0) {
        this.declIndex = 0;
        this.declStepper.selectedIndex = 0;
        this.handleDeclChange({ selectedIndex: 0 } as StepperSelectionEvent);
      } else {
        this.declIndex = -1;
        this.declStepper.selectedIndex = -1;
      }
    } else {
      if (this.intSteps && this.intSteps.length > 0) {
        this.intIndex = 0;
        this.intStepper.selectedIndex = 0;
        this.handleIntChange({ selectedIndex: 0 } as StepperSelectionEvent);
      } else {
        this.intIndex = -1;
        this.intStepper.selectedIndex = -1;
      }
    }
  }

  /* ───────── Cambio de pestaña (mat‑tab) ───────── */
  onTabChange(event: any): void {
    const ev = event as MatTabChangeEvent;


    // Bloquear cambio de tab si está creando y no están completos los antecedentes
    if (this.isCreating && event > 0) {
      if (!this.areAntecedentesComplete()) {
        // Revertir al tab anterior
        this.tabGroup.selectedIndex = this.selectedTabIndex;
        return;
      }
    }

    this.selectedTabIndex = event;
    if (event === 0) {
      this.currentBlock = 'decl';
      this.state.setActiveBlock('decl');
      setTimeout(() => this.loadDeclStep(this.declIndex));
    } else if (event === 1) {
      this.currentBlock = 'int';
      this.state.setActiveBlock('int');

      // Verificar si hay un declarante activo
      this.state.activeId$.pipe(take(1)).subscribe(activeId => {
        if (!activeId) {
          this._auth.currentUser$.pipe(take(1)).subscribe(user => {
            console.log(user)

          })
          // Si no hay declarante activo, buscar el declarante principal
          this.state.declaraciones$.pipe(take(1)).subscribe(declaraciones => {
            const mainDeclarante = declaraciones.find(d => d.esDeclarante);
            if (mainDeclarante) {
              // Establecer el declarante principal como activo
              this.state.setActiveDeclaracion(mainDeclarante.id);
              this.state.setActiveDeclarante(mainDeclarante.id);
            }
          });
        }
      });

      setTimeout(() => {
        if (this.intIndex === -1) {
          this.intIndex = 0;
        }
        this.loadIntStep(this.intIndex);
      });
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

  openDeclarantesModal(): void {
    this.dialog.open(this.declaracionModal, {
      width: '850px',
      disableClose: true
    });
  }
  closeDeclarantesModal(): void { this.showDeclarantesModal = false; }

  selectDeclarante(id: string): void {
    // Actualizar tanto la declaración como el declarante activo
    this.state.setActiveDeclaracion(id);
    this.state.setActiveDeclarante(id);

    // Cerrar el modal
    this.dialog.closeAll();

    // Solo actualizamos el stepper de intereses
    this.state.setActiveBlock('int');

    // Resetear el índice para forzar la carga del primer paso
    this.intIndex = -1;

    // Esperar a que los pasos estén disponibles
    setTimeout(() => {
      if (this.intSteps && this.intSteps.length > 0) {
        const firstEnabledStep = this.intSteps.findIndex(step => step.enabled);
        if (firstEnabledStep >= 0) {
          this.intStepper.selectedIndex = firstEnabledStep;
          this.intIndex = firstEnabledStep;
          const step = this.intSteps[firstEnabledStep];
          const componentName = step.component;
          if (componentName && COMPONENT_MAP[componentName]) {
            this.activeComponent = COMPONENT_MAP[componentName];
          }
        }
      } else {
        this.intIndex = -1;
        this.intStepper.selectedIndex = -1;
      }
    });
  }

  /* DECLARANTE */
  handleDeclChange(ev: StepperSelectionEvent): void {
    if (!this.declSteps || this.declSteps.length === 0) {
      this.declIndex = -1;
      return;
    }

    // Asegurarnos de que el índice esté dentro de los límites
    const newIndex = Math.min(Math.max(0, ev.selectedIndex), this.declSteps.length - 1);
    this.declIndex = newIndex;

    const key = this.declSteps[this.declIndex].key;
    this.activeComponent = COMPONENT_MAP[this.declSteps[this.declIndex].component!];
    this.state.setCurrentStep(key);
    
    // Actualizar el estado de los pasos
    this.validateAntecedentesProgress();
    
    this.intStepper.selectedIndex = -1;
    this.intIndex = -1;
  }

  /* INTERESES */
  handleIntChange(ev: StepperSelectionEvent): void {
    if (!this.intSteps || this.intSteps.length === 0) {
      this.intIndex = -1;
      return;
    }

    // Obtener el paso actual y el paso objetivo
    const currentStep = this.intSteps[this.intIndex];
    const targetStep = this.intSteps[ev.selectedIndex];

    // Verificar si el paso existe y está habilitado
    if (targetStep && targetStep.enabled) {
      // Actualizar el índice
      this.intIndex = ev.selectedIndex;

      // Actualizar el componente activo
      const componentName = targetStep.component;
      if (componentName && COMPONENT_MAP[componentName]) {
        this.activeComponent = COMPONENT_MAP[componentName];
      }

      // Actualizar el paso actual en el estado
      this.state.setCurrentStep(targetStep.key);

      // Limpiar el stepper de declarante
      this.declStepper.selectedIndex = -1;
      this.declIndex = -1;
    } else {
      // Si el paso no es válido, mantener el índice actual
      this.intStepper.selectedIndex = this.intIndex;
    }
  }

  /* ───────── Helpers de carga ───────── */
  loadStep(type: 'decl' | 'int', idx: number): void {
    console.log('loadStep', type, idx);
    const step = type === 'decl' ? this.declSteps[idx] : this.intSteps[idx];
    if (step) {
      const componentName = step.component;
      if (componentName && COMPONENT_MAP[componentName]) {
        this.activeComponent = COMPONENT_MAP[componentName];
      }
      this.cd.detectChanges();
    }
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
          if (this.declIndex === idx) {
            this.loadDeclStep(idx);
          } else {
            this.declStepper.selectedIndex = idx;
            this.handleDeclChange({ selectedIndex: idx } as StepperSelectionEvent);
          }
        });
      });

    /* INTERESES */
    this.intContainer.nativeElement
      .querySelectorAll<HTMLElement>('.mat-step-header')
      .forEach((hdr, idx) => {
        hdr.style.cursor = 'pointer';
        hdr.addEventListener('click', () => {
          const step = this.intSteps[idx];
          if (step && step.enabled) {
            if (this.intIndex === idx) {
              this.loadIntStep(idx);
            } else {
              this.intStepper.selectedIndex = idx;
              this.handleIntChange({ selectedIndex: idx } as StepperSelectionEvent);
            }
          }
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

  areAntecedentesComplete(): boolean {
    return this.state.isComplete('paso1') &&
      this.state.isComplete('paso2') &&
      this.state.isComplete('paso3') &&
      this.state.isComplete('paso4');
  }

  private validateAntecedentesProgress(): void {
    // Solo actualizamos isCreating si estamos en modo creación
    // if (this.state.declaracionId === 0) {
      // Verificamos cada paso individualmente
      const paso1Completo = this.state.isComplete('paso1');
      const paso2Completo = this.state.isComplete('paso2');
      const paso3Completo = this.state.isComplete('paso3');
      const paso4Completo = this.state.isComplete('paso4');

      // Actualizamos el estado de cada paso en el stepper
      this.declSteps.forEach(step => {
        switch(step.key) {
          case 'paso1':
            step.status = paso1Completo ? 'completed' : 'incomplete';
            break;
          case 'paso2':
            step.status = paso2Completo ? 'completed' : 'incomplete';
            break;
          case 'paso3':
            step.status = paso3Completo ? 'completed' : 'incomplete';
            break;
          case 'paso4':
            step.status = paso4Completo ? 'completed' : 'incomplete';
            break;
          default:
            step.status = 'pending';
        }
      });

      // Solo marcamos como no-creando si todos los pasos están completos
      if (paso1Completo && paso2Completo && paso3Completo && paso4Completo) {
        this.state.setIsCreating(false);
        this.isCreating = false;
      } else {
        this.state.setIsCreating(true);
        this.isCreating = true;
      }
    // }
  }
}
