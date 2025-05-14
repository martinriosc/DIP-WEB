import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

// Importa los componentes que se usan en el stepsObj
import { Paso1DeclaracionComponent } from './antecedentes-declarante/paso-1-declaracion/paso-1-declaracion.component';
import { Paso2DatosPersonalesComponent } from './antecedentes-declarante/paso-2-datos-personales/paso-2-datos-personales.component';
import { Paso3EntidadComponent } from './antecedentes-declarante/paso-3-entidad/paso-3-entidad.component';
import { Paso4TutelaComponent } from './antecedentes-declarante/paso-4-tutela/paso-4-tutela.component';
import { Paso5ActividadesComponent } from './intereses-y-patrimonios/paso-5-actividades/paso-5-actividades.component';
import { Paso6BienesInmueblesComponent } from './intereses-y-patrimonios/paso-6-bienes-inmuebles/paso-6-bienes-inmuebles.component';
import { Paso7DerechosAguasComponent } from './intereses-y-patrimonios/paso-7-derechos-aguas/paso-7-derechos-aguas.component';
import { Paso8BienesMueblesComponent } from './intereses-y-patrimonios/paso-8-bienes-muebles/paso-8-bienes-muebles.component';
import { Paso9DerechosAccionesComponent } from './intereses-y-patrimonios/paso-9-derechos-acciones/paso-9-derechos-acciones.component';
import { Paso10ValoresComponent } from './intereses-y-patrimonios/paso-10-valores/paso-10-valores.component';
import { Paso11ValoresObligatoriosComponent } from './intereses-y-patrimonios/paso-11-valores-obligatorios/paso-11-valores-obligatorios.component';
import { Paso12MandatoEspecialComponent } from './intereses-y-patrimonios/paso-12-mandato-especial/paso-12-mandato-especial.component';
import { Paso13PasivosComponent } from './intereses-y-patrimonios/paso-13-pasivos/paso-13-pasivos.component';
import { Paso14FuenteConflictoComponent } from './intereses-y-patrimonios/paso-14-fuente-conflicto/paso-14-fuente-conflicto.component';
import { Paso15OtrosBienesComponent } from './intereses-y-patrimonios/paso-15-otros-bienes/paso-15-otros-bienes.component';
import { Paso16AntecedentesComponent } from './intereses-y-patrimonios/paso-16-antecedentes/paso-16-antecedentes.component';

import { MatStepHeader } from '@angular/material/stepper';

@Component({
  selector: 'app-declaracion-detalle',
  templateUrl: './declaracion-detalle.component.html',
  styleUrls: ['./declaracion-detalle.component.scss']
})
export class DeclaracionDetalleComponent implements OnInit {
  @ViewChild('stepperContainer') stepperContainer!: ElementRef<HTMLDivElement>;
  @ViewChildren(MatStepHeader) stepHeaders!: QueryList<MatStepHeader>;




  formGroups: FormGroup[] = [];

  currentStepIndex = 0;

  isNewDeclaration = true;

  /** Último paso habilitado/guardado (si fuese edición). */
  lastSavedStepIndex = 0;

  /** Porcentaje global de completitud (pasos + subpasos). */
  completionPercentage = 0;
  visitedSteps: boolean[] = [];                 /* nuevo */
  completion = 0;                         // %

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    // Cargamos stepsObj en el servicio
    // this.validadorService.setSteps(this.stepsObj);
    // this.formGroups = this.stepsObj.map(() => this.fb.group({ dummy: [''] }));
    // this.visitedSteps = this.stepsObj.map((_) => false);
    // this.visitedSteps[0] = true;                // primer paso activo

    // /* actualiza % en tiempo real */
    // this.validadorService.steps$.subscribe(() =>
    //   this.completionPercentage = this.validadorService.getCompletionPercentage()
    // );
  }

  isVisited(idx: number): boolean { return this.visitedSteps[idx]; }


  /**
   * Llamado cuando el usuario hace clic en “Guardar/Siguiente”.
   * Marca el paso actual como completo o incompleto, según validez del form.
   */
  onClickGuardarPaso(i: number): void {
    // const currentForm = this.formGroups[i];
    // const stepKey = this.stepsObj[i].key;


    // if (currentForm.valid && !this.validadorService.isComplete(stepKey)) {
    //   // Marcamos como completo
    //   this.validadorService.markComplete(stepKey);
    //   // Avanzamos al siguiente paso si no es el último
    //   if (i < this.stepsObj.length - 1) {
    //     this.lastSavedStepIndex = Math.max(this.lastSavedStepIndex, i + 1);
    //     this.currentStepIndex = i + 1;
    //   }
    // } else {
    //   // Marcamos como incompleto
    //   this.validadorService.markIncomplete(stepKey);
    // }
  }

  /**
   * Al pulsar “Finalizar” en el último paso, si todo (pasos y subpasos) está completo => enviar.
   */
  onFinalizar(): void {
    // const i = this.stepsObj.length - 1;
    // const currentForm = this.formGroups[i];
    // const stepKey = this.stepsObj[i].key;

    // if (currentForm.valid) {
    //   this.validadorService.markComplete(stepKey);
    // } else {
    //   this.validadorService.markIncomplete(stepKey);
    // }

    // // Verificamos si todos los pasos+subpasos están completos
    // const finalPercentage = this.validadorService.getCompletionPercentage();
    // if (finalPercentage === 100) {
    //   this.validadorService.enviarDeclaracionFinal();
    // } else {
    //   console.warn(
    //     'Aún hay pasos o subpasos incompletos. Porcentaje actual:',
    //     finalPercentage
    //   );
    // }
  }

  /**
   * Controlar si el paso “i” está habilitado. 
   * (Por ejemplo: i <= lastSavedStepIndex)
   */
  isStepEnabled(i: number): boolean {
    return i <= this.lastSavedStepIndex;
  }

  /**
   * Manejamos el evento de cambio de selección en el Stepper,
   * actualizando currentStepIndex y centrando el ítem en scroll horizontal.
   */
  // onSelectionChange(event: StepperSelectionEvent): void {
  //   this.currentStepIndex = event.selectedIndex;

  //   setTimeout(() => {
  //     const index = this.currentStepIndex;
  //     const stepHeader = this.stepHeaders.toArray()[index];
  //     if (!stepHeader) return;

  //     const stepHeaderElement = stepHeader._elementRef.nativeElement;
  //     const containerRect = this.stepperContainer.nativeElement.getBoundingClientRect();
  //     const stepHeaderRect = stepHeaderElement.getBoundingClientRect();

  //     const containerScrollLeft = this.stepperContainer.nativeElement.scrollLeft;
  //     const stepHeaderCenter = stepHeaderRect.left + stepHeaderRect.width / 2;
  //     const containerCenter = containerRect.left + containerRect.width / 2;
  //     const offset = stepHeaderCenter - containerCenter;
  //     this.stepperContainer.nativeElement.scrollLeft = containerScrollLeft + offset;
  //   }, 0);
  // }

  onSelectionChange(e: StepperSelectionEvent): void {
    this.currentStepIndex = e.selectedIndex;
    this.visitedSteps[e.selectedIndex] = true;
    this.centrarHeader(e.selectedIndex);
  }
  private centrarHeader(i: number): void {
    setTimeout(() => {
      const header = this.stepHeaders.get(i);
      if (!header) return;
      const elem = header._elementRef.nativeElement;
      const cont = this.stepperContainer.nativeElement;
      cont.scrollLeft += (elem.getBoundingClientRect().left
        + elem.offsetWidth / 2)
        - (cont.getBoundingClientRect().left
          + cont.offsetWidth / 2);
    });
  }
}
