import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Paso2DatosPersonalesComponent } from './paso-2-datos-personales/paso-2-datos-personales.component';
import { Paso3EntidadComponent } from './paso-3-entidad/paso-3-entidad.component';
import { Paso1DeclaracionComponent } from './paso-1-declaracion/paso-1-declaracion.component';
import { Paso4TutelaComponent } from './paso-4-tutela/paso-4-tutela.component';
import { Paso5ActividadesComponent } from './paso-5-actividades/paso-5-actividades.component';
import { Paso6BienesInmueblesComponent } from './paso-6-bienes-inmuebles/paso-6-bienes-inmuebles.component';
import { Paso7DerechosAguasComponent } from './paso-7-derechos-aguas/paso-7-derechos-aguas.component';
import { Paso8BienesMueblesComponent } from './paso-8-bienes-muebles/paso-8-bienes-muebles.component';
import { Paso9DerechosAccionesComponent } from './paso-9-derechos-acciones/paso-9-derechos-acciones.component';
import { Paso10ValoresComponent } from './paso-10-valores/paso-10-valores.component';
import { Paso11ValoresObligatoriosComponent } from './paso-11-valores-obligatorios/paso-11-valores-obligatorios.component';
import { Paso12MandatoEspecialComponent } from './paso-12-mandato-especial/paso-12-mandato-especial.component';
import { Paso13PasivosComponent } from './paso-13-pasivos/paso-13-pasivos.component';
import { Paso14FuenteConflictoComponent } from './paso-14-fuente-conflicto/paso-14-fuente-conflicto.component';
import { Paso15OtrosBienesComponent } from './paso-15-otros-bienes/paso-15-otros-bienes.component';
import { Paso16AntecedentesComponent } from './paso-16-antecedentes/paso-16-antecedentes.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepHeader } from '@angular/material/stepper';
import { ValidadorDeclaracionService } from '../../services/validador-declaracion.service';

@Component({
  selector: 'app-declaracion-create',
  standalone: false,
  templateUrl: './declaracion-create.component.html',
  styleUrls: ['./declaracion-create.component.scss']
})
export class DeclaracionCreateComponent {
  @ViewChild('stepperContainer') stepperContainer!: ElementRef<HTMLDivElement>;
  @ViewChildren(MatStepHeader) stepHeaders!: QueryList<MatStepHeader>;
  steps = [
    { label: '1.1.- Datos de la Declaración', key: 'paso1', component: Paso1DeclaracionComponent },
    { label: '1.2.- Datos Personales', key: 'paso2', component: Paso2DatosPersonalesComponent },
    { label: '1.3.- Datos de la Entidad', key: 'paso3', component: Paso3EntidadComponent },
    { label: '1.4.- Hijos bajo Patria Potestad',  key: 'paso4',component: Paso4TutelaComponent },

    { label: '2.1.- Actividades', key: 'paso5', component: Paso5ActividadesComponent },
    { label: '2.2.- Bienes Inmuebles', key: 'paso6', component: Paso6BienesInmueblesComponent },
    { label: '2.3.- Derechos de Aprovechamiento de Aguas',  key: 'paso7',component: Paso7DerechosAguasComponent },
    { label: '2.4.- Bienes Muebles Registrables', key: 'paso8', component: Paso8BienesMueblesComponent },
    { label: '2.5.- Derechos o Acciones en Entidades',  key: 'paso9',component: Paso9DerechosAccionesComponent },
    { label: '2.6.- Valores (Instrumentos Financieros Transables)',  key: 'paso10',component: Paso10ValoresComponent },
    { label: '2.7.- Valores Obligatorios Adicionales', key: 'paso11', component: Paso11ValoresObligatoriosComponent },
    { label: '2.8.- Mandato Especial de Administración de Valores',  key: 'paso12',component: Paso12MandatoEspecialComponent },
    { label: '2.9.- Pasivos', key: 'paso13', component: Paso13PasivosComponent },
    { label: '2.10.- Otra Fuente de Conflicto de Interés',  key: 'paso14',component: Paso14FuenteConflictoComponent },
    { label: '2.11.- Otros Bienes Financieros y Físicos', key: 'paso15', component: Paso15OtrosBienesComponent },
    { label: '2.12.- Antecedentes Adicionales',  key: 'paso16',component: Paso16AntecedentesComponent },
  ];

  formGroups: FormGroup[];

  visitedSteps: boolean[] = [];

  constructor(private fb: FormBuilder, public validador: ValidadorDeclaracionService) {
    // Generar un formGroup básico para cada paso
    this.visitedSteps = Array(this.steps.length).fill(false);
    this.visitedSteps[0] = true;
    this.formGroups = this.steps.map(() =>
      this.fb.group({
        input: [''], // Ajusta según las necesidades del paso
      })
    );
  }

  submit() {
    // Se llamaría cuando pulses “Finalizar” en el último paso
    // Verificamos si todos los pasos están completos
    if (this.validador.estanTodosCompletos()) {

      if (this.formGroups.every((fg) => fg.valid)) {
        console.log('Formulario enviado con éxito', this.formGroups.map((fg) => fg.value));
        this.validador.enviarDeclaracionFinal();

      }
      // Enviar la declaración
    } else {
      console.warn('Hay pasos incompletos:', this.validador.getAdvertencias());
    }
  }

  avanzarPaso(i: number): void {
    // Chequea validez del form
    const formValido = this.formGroups[i].valid;
    // Marca en el servicio si este paso se completó
    this.validador.setPasoCompleto(this.steps[i].key, formValido);
  }

  /**
   * Centra el paso seleccionado en la vista horizontal del contenedor
   * cada vez que cambiamos de step (selectionChange).
   */
  onSelectionChange(event: StepperSelectionEvent) {
    this.visitedSteps[event.selectedIndex] = true;

    // Pequeño timeout para asegurar que el render esté terminado
    setTimeout(() => {
      const index = event.selectedIndex;
      this.visitedSteps[index] = true;

      const stepHeader = this.stepHeaders.toArray()[index];
      if (!stepHeader) return;

      const stepHeaderElement = stepHeader._elementRef.nativeElement;
      const containerRect = this.stepperContainer.nativeElement.getBoundingClientRect();
      const stepHeaderRect = stepHeaderElement.getBoundingClientRect();

      const containerScrollLeft = this.stepperContainer.nativeElement.scrollLeft;
      const stepHeaderCenter = stepHeaderRect.left + stepHeaderRect.width / 2;
      const containerCenter = containerRect.left + containerRect.width / 2;

      // Calcula la diferencia para centrar el paso activo
      const offset = stepHeaderCenter - containerCenter;
      this.stepperContainer.nativeElement.scrollLeft = containerScrollLeft + offset;
    }, 0);
  }

  
}
