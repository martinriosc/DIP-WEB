import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, TemplateRef, Type, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { BehaviorSubject, combineLatest, map, Observable, Subject, takeUntil, take, finalize, debounceTime, of, distinctUntilChanged, startWith } from 'rxjs';

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
  styleUrls: ['./dip-stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DipStepperComponent {

  @ViewChild('declaracionModal') declaracionModal!: TemplateRef<any>;
  @ViewChild('declStepper', { static: true }) declStepper!: MatStepper;
  @ViewChild('intStepper', { static: true }) intStepper!: MatStepper;
  @ViewChild('declContainer', { static: true, read: ElementRef }) declContainer!: ElementRef<HTMLElement>;
  @ViewChild('intContainer', { static: true, read: ElementRef }) intContainer!: ElementRef<HTMLElement>;

  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  private currentBlock: 'decl' | 'int' = 'decl';
  activeDeclName$: Observable<string> = this.state.activeDeclarante$.pipe(map(d => d.declara));

  // Observables para control de estado de la UI
  private selectedTabIndexSubject = new BehaviorSubject<number>(0);
  selectedTabIndex$ = this.selectedTabIndexSubject.asObservable();
  
  private editModeSubject = new BehaviorSubject<boolean>(false);
  editMode$ = this.editModeSubject.asObservable();
  
  private currentItemSubject = new BehaviorSubject<any | null>(null);
  currentItem$ = this.currentItemSubject.asObservable();
  
  private isCreatingSubject = new BehaviorSubject<boolean>(false);
  isCreating$ = this.isCreatingSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  isLoading$ = this.isLoadingSubject.asObservable();
  
  private declIndexSubject = new BehaviorSubject<number>(0);
  declIndex$ = this.declIndexSubject.asObservable();
  
  private intIndexSubject = new BehaviorSubject<number>(-1);
  intIndex$ = this.intIndexSubject.asObservable();
  
  private activeComponentSubject = new BehaviorSubject<Type<unknown> | null>(null);
  activeComponent$ = this.activeComponentSubject.asObservable();
  
  private showDeclarantesModalSubject = new BehaviorSubject<boolean>(false);
  showDeclarantesModal$ = this.showDeclarantesModalSubject.asObservable();

  /* ───── Streams (async pipes en template) ───── */
  declaraciones$ = this.state.declaraciones$;
  activeId$ = this.state.activeId$;
  globalProgress$ = this.state.globalProgress$;
  declProgress$ = this.state.declProgress$;
  intProgress$ = this.state.intProgress$;

  /* Streams combinados para optimizar la detección de cambios */
  declSteps$ = this.state.declaranteSteps$.pipe(distinctUntilChanged());
  intSteps$ = this.state.interesesSteps$.pipe(distinctUntilChanged());

  /* Datos combinados para la UI */
  uiState$ = combineLatest([
    this.declSteps$,
    this.intSteps$,
    this.declIndex$,
    this.intIndex$,
    this.isCreating$,
    this.state.globalProgress$,
    this.activeComponent$
  ]).pipe(
    debounceTime(10),
    distinctUntilChanged()
  );

  /* ───── Interno ───── */
  private destroy$ = new Subject<void>();

  // Variables de respaldo para getters/setters
  private _declaracionId: number = 0;
  private _declaranteId: number = 0;
  private _declSteps: Step[] = [];
  private _intSteps: Step[] = [];

  constructor(
    private readonly state: DeclaracionHelperService,
    private readonly dialog: MatDialog,
    private readonly cd: ChangeDetectorRef,
    private _auth: AuthService,
    private _spinner: NgxSpinnerService
  ) { }

  /* ───────── Ciclo de vida ───────── */
  ngOnInit(): void {
    this.isLoadingSubject.next(true);
    
    // Suscripción al estado isCreating
    this.state.isCreating$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isCreating => {
        this.isCreatingSubject.next(isCreating);
        // Notificar al ChangeDetector
        this.cd.markForCheck();
      });

    // Suscripción a los pasos del declarante
    this.state.declaranteSteps$
      .pipe(takeUntil(this.destroy$))
      .subscribe(s => {
        this._declSteps = s;
        // Verificar si hay declaracionId cada vez que cambian los pasos
        this.checkDeclaracionIdAndUpdateCreatingState();
        // Notificar al ChangeDetector
        this.cd.markForCheck();
      });

    // Suscripción a los pasos de intereses
    this.state.interesesSteps$
      .pipe(takeUntil(this.destroy$))
      .subscribe(s => {
        this._intSteps = s;
        // Solo actualizar el índice si estamos cambiando de pestaña o seleccionando un nuevo declarante
        if (this.selectedTabIndexSubject.value === 1 && s.length > 0 && this.intIndexSubject.value === -1) {
          this.intIndexSubject.next(0);
          this.handleIntChange({ selectedIndex: 0 } as StepperSelectionEvent);
        }
        // Notificar al ChangeDetector
        this.cd.markForCheck();
      });

    // Inicializar con el declarante principal
    this.state.initializeWithMainDeclarante();

    // Suscripción a nextStep para avances del stepper
    this.state.nextStep$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(100)
      )
      .subscribe(() => {
        console.log('Ejecutando advanceVisualStepper');
        this.advanceVisualStepper();
      });

    this.state.block$
      .pipe(takeUntil(this.destroy$))
      .subscribe(b => this.resetToBlock(b));

    this.state.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (!this.isCreatingSubject.value) {
          this.validateAntecedentesProgress();
        }
        this.cd.markForCheck();
      });

    this.state.currentStepKey$
      .pipe(takeUntil(this.destroy$))
      .subscribe(key => this.syncVisualStepper(key));

    // Usar setTimeout solo para la carga inicial y después confiar en el flujo reactivo
    setTimeout(() => {
      this.isLoadingSubject.next(false);
      this.cd.markForCheck();
    }, 2500);
  }

  ngAfterViewInit(): void {
    this.loadDeclStep(0);
    this.attachHeaderClicks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Getters/setters para compatibilidad con el código existente
  get declSteps(): Step[] {
    return this._declSteps;
  }

  get intSteps(): Step[] {
    return this._intSteps;
  }

  get declIndex(): number {
    return this.declIndexSubject.value;
  }

  set declIndex(value: number) {
    this.declIndexSubject.next(value);
  }

  get intIndex(): number {
    return this.intIndexSubject.value;
  }

  set intIndex(value: number) {
    this.intIndexSubject.next(value);
  }

  get isCreating(): boolean {
    return this.isCreatingSubject.value;
  }

  set isCreating(value: boolean) {
    this.isCreatingSubject.next(value);
  }

  get activeComponent(): Type<unknown> | null {
    return this.activeComponentSubject.value;
  }

  set activeComponent(value: Type<unknown> | null) {
    this.activeComponentSubject.next(value);
  }

  get selectedTabIndex(): number {
    return this.selectedTabIndexSubject.value;
  }

  set selectedTabIndex(value: number) {
    this.selectedTabIndexSubject.next(value);
  }

  private syncVisualStepper(key: string): void {
    console.log('=== Inicio syncVisualStepper ===');
    console.log('Clave del paso a sincronizar:', key);
    console.log('Bloque actual:', this.currentBlock);

    if (this.currentBlock === 'decl') {
      const idx = this.declSteps.findIndex(s => s.key === key);
      console.log('Índice encontrado en declarante:', idx);
      console.log('Índice actual del stepper:', this.declStepper.selectedIndex);
      
      if (idx >= 0 && this.declStepper.selectedIndex !== idx) {
        console.log('Actualizando stepper declarante a índice:', idx);
        this.declStepper.selectedIndex = idx;
        this.declIndex = idx;
      }
    } else {
      const idx = this.intSteps.findIndex(s => s.key === key);
      console.log('Índice encontrado en intereses:', idx);
      
      if (idx >= 0 && this.intStepper.selectedIndex !== idx) {
        const step = this.intSteps[idx];
        console.log('Paso encontrado:', step);
        
        if (step && step.enabled) {
          console.log('Actualizando stepper intereses a índice:', idx);
          this.intStepper.selectedIndex = idx;
          this.intIndex = idx;

          const componentName = step.component;
          if (componentName && COMPONENT_MAP[componentName]) {
            console.log('Actualizando componente activo:', componentName);
            this.activeComponent = COMPONENT_MAP[componentName];
          }
        }
      }
    }
    console.log('=== Fin syncVisualStepper ===');
  }

  private advanceVisualStepper(): void {
    /* Sólo efectos visuales */
    console.log('advanceVisualStepper - Bloque actual:', this.currentBlock);
    
    // Verificar si estamos avanzando a paso-5 desde el bloque de declarante
    // Lo que significa que estamos avanzando desde paso-4 a paso-5
    this.state.currentStepKey$.pipe(take(1)).subscribe(currentStep => {
      console.log('currentStep', currentStep);
      console.log('currentBlock', this.currentBlock);
      
      // Solo cambiar a la pestaña de Intereses cuando el paso actual es paso-5
      // Esto indica que acabamos de avanzar desde paso-4 (último del declarante)
      if (this.currentBlock === 'decl' && currentStep === 'paso5') {
        // Esto indica que acabamos de avanzar desde el paso-4 al paso-5
        console.log('Avanzando del paso-4 al paso-5, actualizando tab');
        // Forzar cambio de tab a Intereses y Patrimonios
        this.selectedTabIndexSubject.next(1);
        // Actualizar el bloque actual
        this.currentBlock = 'int';
        
        // Notificar cambios
        this.cd.markForCheck();
      }
    });
    
    // Centrar el contenedor apropiado
    if (this.currentBlock === 'decl') {
      this.center(this.declContainer);
    } else {
      this.center(this.intContainer);
    }
    
    // Notificar cambios
    this.cd.markForCheck();
  }

  private resetToBlock(b: 'decl' | 'int'): void {
    console.log('resetToBlock:', b, 'Bloque actual:', this.currentBlock);
    this.currentBlock = b;

    /* ①  Cambiar mat‑tab de forma imperativa */
    const tabIndex = b === 'decl' ? 0 : 1;
    console.log('Cambiando a tabIndex:', tabIndex);
    if (this.tabGroup && this.tabGroup.selectedIndex !== tabIndex) {
      this.tabGroup.selectedIndex = tabIndex;
      this.selectedTabIndexSubject.next(tabIndex);
    }

    /* ②  Reposicionar el stepper correspondiente */
    if (b === 'decl') {
      if (this._declSteps && this._declSteps.length > 0) {
        this.declIndexSubject.next(0);
        this.declStepper.selectedIndex = 0;
        this.handleDeclChange({ selectedIndex: 0 } as StepperSelectionEvent);
      } else {
        this.declIndexSubject.next(-1);
        this.declStepper.selectedIndex = -1;
      }
    } else {
      if (this._intSteps && this._intSteps.length > 0) {
        this.intIndexSubject.next(0);
        this.intStepper.selectedIndex = 0;
        this.handleIntChange({ selectedIndex: 0 } as StepperSelectionEvent);
      } else {
        this.intIndexSubject.next(-1);
        this.intStepper.selectedIndex = -1;
      }
    }

    // Notificar cambios
    this.cd.markForCheck();
  }

  /* ───────── Cambio de pestaña (mat‑tab) ───────── */
  onTabChange(event: any): void {
    const ev = event as MatTabChangeEvent;
    const newIndex = typeof event === 'number' ? event : event.index;
    console.log('onTabChange - Nuevo índice:', newIndex);

    // Bloquear cambio de tab si está creando y no están completos los antecedentes
    if (this.isCreatingSubject.value && newIndex > 0) {
      if (!this.areAntecedentesComplete()) {
        // Revertir al tab anterior
        console.log('Bloqueando cambio de tab - Antecedentes incompletos');
        this.tabGroup.selectedIndex = this.selectedTabIndexSubject.value;
        return;
      }
    }

    this.selectedTabIndexSubject.next(newIndex);
    
    if (newIndex === 0) {
      this.currentBlock = 'decl';
      this.state.setActiveBlock('decl');
      // Usar of().subscribe en lugar de setTimeout para mantener un enfoque reactivo
      of(null).subscribe(() => this.loadDeclStep(this.declIndexSubject.value));
    } else if (newIndex === 1) {
      this.currentBlock = 'int';
      this.state.setActiveBlock('int');

      // Verificar si hay un declarante activo
      this.state.activeId$.pipe(take(1)).subscribe(activeId => {
        if (!activeId) {
          // Si no hay declarante activo, buscar el declarante principal
          this.state.declaraciones$.pipe(take(1)).subscribe(declaraciones => {
            const mainDeclarante = declaraciones.find(d => d.esDeclarante);
            if (mainDeclarante) {
              // Establecer el declarante principal como activo
              console.log('Seleccionando declarante principal:', mainDeclarante.declara);
              this.state.setActiveDeclaracion(mainDeclarante.id);
              this.state.setActiveDeclarante(mainDeclarante.id);
            }
          });
        }
      });

      // Usar of().subscribe en lugar de setTimeout para mantener un enfoque reactivo
      of(null).subscribe(() => {
        const currentIntIndex = this.intIndexSubject.value;
        if (currentIntIndex === -1) {
          this.intIndexSubject.next(0);
          this.intStepper.selectedIndex = 0;
        }
        this.loadIntStep(currentIntIndex === -1 ? 0 : currentIntIndex);
      });
    }

    // Notificar cambios
    this.cd.markForCheck();
  }

  /* ───────── Modal de declarantes ───────── */
  openAddModal(): void {
    this.editModeSubject.next(false);
    this.dialog.open(this.declaracionModal, { width: '850px' });
  }
  openEditModal(item: any): void {
    this.editModeSubject.next(true);
    this.currentItemSubject.next(item);
    this.dialog.open(this.declaracionModal, { width: '850px' });
  }

  openDeclarantesModal(): void {
    this.dialog.open(this.declaracionModal, {
      width: '850px',
      disableClose: true
    });
  }
  closeDeclarantesModal(): void { this.showDeclarantesModalSubject.next(false); }

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
    console.log('=== Inicio handleDeclChange ===');
    console.log('Evento de cambio:', ev);
    
    if (!this._declSteps || this._declSteps.length === 0) {
      console.log('No hay pasos disponibles');
      this.declIndexSubject.next(-1);
      return;
    }

    // Asegurarnos de que el índice esté dentro de los límites
    const newIndex = Math.min(Math.max(0, ev.selectedIndex), this._declSteps.length - 1);
    console.log('Nuevo índice calculado:', newIndex);
    console.log('Índice actual:', this.declIndexSubject.value);
    
    // Actualizar el índice
    this.declIndexSubject.next(newIndex);
    const currentStep = this._declSteps[newIndex];
    console.log('Paso actual:', currentStep);
    
    // Actualizar el componente activo
    if (currentStep.component) {
      console.log('Actualizando componente activo:', currentStep.component);
      this.activeComponentSubject.next(COMPONENT_MAP[currentStep.component]);
    }
    
    // Actualizar el paso actual en el estado
    console.log('Actualizando paso actual en estado:', currentStep.key);
    this.state.setCurrentStep(currentStep.key);
    
    // Verificar si hay declaracionId cada vez que cambia el paso
    this.checkDeclaracionIdAndUpdateCreatingState();
    
    // Actualizar el estado de los pasos
    this.validateAntecedentesProgress();
    
    // Limpiar el stepper de intereses
    this.intStepper.selectedIndex = -1;
    this.intIndexSubject.next(-1);

    // Notificar cambios
    this.cd.markForCheck();
    console.log('=== Fin handleDeclChange ===');
  }

  /* INTERESES */
  handleIntChange(ev: StepperSelectionEvent): void {
    if (!this._intSteps || this._intSteps.length === 0) {
      this.intIndex = -1;
      return;
    }

    // Obtener el paso actual y el paso objetivo
    const currentIndex = this.intIndex;
    const currentStep = currentIndex >= 0 ? this._intSteps[currentIndex] : null;
    const targetStep = this._intSteps[ev.selectedIndex];

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

    // Notificar cambios
    this.cd.markForCheck();
  }

  /* ───────── Helpers de carga ───────── */
  loadStep(type: 'decl' | 'int', idx: number): void {
    console.log('loadStep', type, idx);
    const step = type === 'decl' 
      ? (this._declSteps[idx] || null)
      : (this._intSteps[idx] || null);
      
    if (step) {
      const componentName = step.component;
      if (componentName && COMPONENT_MAP[componentName]) {
        this.activeComponentSubject.next(COMPONENT_MAP[componentName]);
      }
      this.cd.markForCheck();
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
          const step = this._intSteps[idx];
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
  getDeclStatus(i: number): Step['status'] { return this._declSteps[i]?.status ?? 'pending'; }
  getIntStatus(i: number): Step['status'] { return this._intSteps[i]?.status ?? 'pending'; }

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
      this._declSteps.forEach(step => {
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

  // Verificar si la declaración ya tiene un ID asignado
  private checkDeclaracionIdAndUpdateCreatingState(): void {
    console.log('Verificando declaracionId...');
    
    // Obtener el declaracionId actual
    const declaracionId = this.state.declaracionId;
    console.log('DeclaracionId actual:', declaracionId);
    
    // Si hay un declaracionId y estamos en modo creación, actualizamos el estado
    if (declaracionId > 0 && this.isCreatingSubject.value) {
      console.log('Declaración ya creada, cambiando a modo edición');
      this.isCreatingSubject.next(false);
      this.state.setIsCreating(false);
    } 
    // Si no hay declaracionId y estamos en el paso 1, debe estar en modo creación
    else if (declaracionId === 0) {
      this.state.currentStepKey$.pipe(take(1)).subscribe(currentStep => {
        if (currentStep === 'paso1') {
          console.log('En paso 1 sin declaracionId, manteniendo modo creación');
          this.isCreatingSubject.next(true);
          this.state.setIsCreating(true);
        }
      });
    }
    
    // Notificar cambios
    this.cd.markForCheck();
  }
}
