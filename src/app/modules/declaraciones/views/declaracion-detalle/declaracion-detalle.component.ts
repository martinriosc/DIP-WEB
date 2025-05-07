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

import { ValidadorDeclaracionService, StepData } from '../../services/validador-declaracion.service';
import { MatStepHeader } from '@angular/material/stepper';

@Component({
  selector: 'app-declaracion-detalle',
  templateUrl: './declaracion-detalle.component.html',
  styleUrls: ['./declaracion-detalle.component.scss']
})
export class DeclaracionDetalleComponent implements OnInit {
  @ViewChild('stepperContainer') stepperContainer!: ElementRef<HTMLDivElement>;
  @ViewChildren(MatStepHeader) stepHeaders!: QueryList<MatStepHeader>;


  objeto = {
    declarante: [
      {
        label: 'Datos de la Declaración',
        key: 'paso1',
        completed: false,
        enabled: true,
        subSteps: [],
        component: Paso1DeclaracionComponent
      },
      {
        label: 'Datos Personales',
        key: 'paso2',
        completed: false,
        enabled: true,
        subSteps: [],
        component: Paso2DatosPersonalesComponent
      },
      {
        label: 'Datos de la Entidad',
        key: 'paso3',
        completed: false,
        enabled: true,
        subSteps: [],
        component: Paso3EntidadComponent
      },
      {
        label: 'Hijos bajo Patria Potestad',
        key: 'paso4',
        completed: false,
        enabled: false,
        subSteps: [],
        component: Paso4TutelaComponent
      },
    ],
    declaraciones: [
      {
        declara: "Christian Contardo",
        relacion: "",
        completed: false,
        step: 5,
        intereses: [
          {
            label: 'Actividades',
            key: 'paso5',
            completed: false,
            enabled: true,
            subSteps: [
              {
                label: 'Actividades en que haya participado en los últimos 12 meses',
                key: 'paso5-1',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Actividades que realiza o en que participa a la fecha de la Declaración',
                key: 'paso5-2',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Actividades que realiza o participa el/la Cónyuge o Conviviente Civil',
                key: 'paso5-3',
                completed: false,
                enabled: true,
                subSteps: []
              }
            ],
            component: Paso5ActividadesComponent
          },
          {
            label: 'Bienes Inmuebles',
            key: 'paso6',
            step: 6,
            completed: false,
            enabled: true,
            subSteps: [
              {
                label: 'Bien Inmueble Situado en Chile',
                key: 'paso6-1',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Bien Inmueble Situado en el Extranjero',
                key: 'paso6-2',
                completed: false,
                enabled: true,
                subSteps: []
              }
            ],
            component: Paso6BienesInmueblesComponent
          },
          {
            label: 'Derechos de Aprovechamiento de Aguas',
            key: 'paso7',
            step: 7,
            completed: false,
            enabled: true,
            subSteps: [
              {
                label: 'Derecho de Aprovechamiento de Aguas',
                key: 'paso7-1',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Concesiones',
                key: 'paso7-2',
                completed: false,
                enabled: true,
                subSteps: []
              }
            ],
            component: Paso7DerechosAguasComponent
          },
          {
            label: 'Bienes Muebles Registrables',
            key: 'paso8',
            step: 8,
            completed: false,
            enabled: true,
            subSteps: [
              {
                label: 'Vehículos Motorizados (Livianos y Pesados)',
                key: 'paso8-1',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Aeronaves',
                key: 'paso8-2',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Naves o Artefactos Navales',
                key: 'paso8-3',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Otros Bienes Muebles registrables',
                key: 'paso8-4',
                completed: false,
                enabled: true,
                subSteps: []
              }
            ],
            component: Paso8BienesMueblesComponent
          },
          {
            label: 'Derechos o Acciones en Entidades',
            key: 'paso9',
            step: 9,
            completed: false,
            enabled: true,
            subSteps: [
              {
                label: 'Derechos o acciones en entidades constituidas en Chile',
                key: 'paso9-1',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Derechos o acciones en entidades constituidas en el Extranjero',
                key: 'paso9-2',
                completed: false,
                enabled: true,
                subSteps: []
              }
            ],
            component: Paso9DerechosAccionesComponent
          },
          {
            label: 'Valores (Instrumentos Financieros Transables)',
            key: 'paso10',
            step: 10,
            completed: false,
            enabled: true,
            subSteps: [
              {
                label: 'Valores o Instrumentos transables en Chile',
                key: 'paso10-1',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Valores o Instrumentos transables en el Extranjero',
                key: 'paso10-2',
                completed: false,
                enabled: true,
                subSteps: []
              }
            ],
            component: Paso10ValoresComponent
          },
          {
            label: 'Valores Obligatorios Adicionales',
            key: 'paso11',
            step: 11,
            completed: false,
            enabled: true,
            subSteps: [
              {
                label: 'Cuentas y/o Libretas de Ahorro',
                key: 'paso11-1',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Ahorro Previsional Voluntario',
                key: 'paso11-2',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Depósito a Plazo',
                key: 'paso11-3',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Seguros',
                key: 'paso11-4',
                completed: false,
                enabled: true,
                subSteps: []
              }
            ],
            component: Paso11ValoresObligatoriosComponent
          },
          {
            label: 'Mandato Especial de Administración de Valores',
            key: 'paso12',
            step: 12,
            completed: false,
            enabled: true,
            subSteps: [],
            component: Paso12MandatoEspecialComponent
          },
          {
            label: 'Pasivos',
            key: 'paso13',
            step:13,
            completed: false,
            enabled: true,
            subSteps: [
              {
                label: 'Deuda por pensión de alimentos',
                key: 'paso13-1',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Pasivos',
                key: 'paso13-2',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Individualización de cada deuda mayor a 100 UTM',
                key: 'paso13-3',
                completed: false,
                enabled: true,
                subSteps: []
              }
            ],
            component: Paso13PasivosComponent
          },
          {
            label: 'Otra Fuente de Conflicto de Interés',
            key: 'paso14',
            step: 14,
            completed: false,
            enabled: true,
            subSteps: [],
            component: Paso14FuenteConflictoComponent
          },
          {
            label: 'Otros Bienes Financieros y Físicos',
            key: 'paso15',
            step:15,
            completed: false,
            enabled: true,
            subSteps: [],
            component: Paso15OtrosBienesComponent
          },
          {
            label: 'Antecedentes Adicionales',
            key: 'paso16',
            step:16,
            completed: false,
            enabled: true,
            subSteps: [],
            component: Paso16AntecedentesComponent
          }
        ]
      },
      {
        declara: "Ejmplo Conyuge Christian",
        relacion: "Conyuge",
        completed: false,
        intereses: [
          {
            label: 'Bienes Inmuebles',
            key: 'paso6',
            step:1,
            completed: false,
            enabled: true,
            subSteps: [
              {
                label: 'Bien Inmueble Situado en Chile',
                key: 'paso6-1',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Bien Inmueble Situado en el Extranjero',
                key: 'paso6-2',
                completed: false,
                enabled: true,
                subSteps: []
              }
            ],
            component: Paso6BienesInmueblesComponent
          },
          {
            label: 'Derechos de Aprovechamiento de Aguas',
            key: 'paso7',
            step:2,
            completed: false,
            enabled: true,
            subSteps: [
              {
                label: 'Derecho de Aprovechamiento de Aguas',
                key: 'paso7-1',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Concesiones',
                key: 'paso7-2',
                completed: false,
                enabled: true,
                subSteps: []
              }
            ],
            component: Paso7DerechosAguasComponent
          },
          {
            label: 'Bienes Muebles Registrables',
            key: 'paso8',
            step: 3,
            completed: false,
            enabled: true,
            subSteps: [
              {
                label: 'Vehículos Motorizados (Livianos y Pesados)',
                key: 'paso8-1',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Aeronaves',
                key: 'paso8-2',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Naves o Artefactos Navales',
                key: 'paso8-3',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Otros Bienes Muebles registrables',
                key: 'paso8-4',
                completed: false,
                enabled: true,
                subSteps: []
              }
            ],
            component: Paso8BienesMueblesComponent
          },
          {
            label: 'Derechos o Acciones en Entidades',
            key: 'paso9',
            step:4,
            completed: false,
            enabled: true,
            subSteps: [
              {
                label: 'Derechos o acciones en entidades constituidas en Chile',
                key: 'paso9-1',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Derechos o acciones en entidades constituidas en el Extranjero',
                key: 'paso9-2',
                completed: false,
                enabled: true,
                subSteps: []
              }
            ],
            component: Paso9DerechosAccionesComponent
          },
          {
            label: 'Valores (Instrumentos Financieros Transables)',
            key: 'paso10',
            step: 5,
            completed: false,
            enabled: true,
            subSteps: [
              {
                label: 'Valores o Instrumentos transables en Chile',
                key: 'paso10-1',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Valores o Instrumentos transables en el Extranjero',
                key: 'paso10-2',
                completed: false,
                enabled: true,
                subSteps: []
              }
            ],
            component: Paso10ValoresComponent
          },
          {
            label: 'Valores Obligatorios Adicionales',
            key: 'paso11',
            step:6,
            completed: false,
            enabled: true,
            subSteps: [
              {
                label: 'Cuentas y/o Libretas de Ahorro',
                key: 'paso11-1',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Ahorro Previsional Voluntario',
                key: 'paso11-2',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Depósito a Plazo',
                key: 'paso11-3',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Seguros',
                key: 'paso11-4',
                completed: false,
                enabled: true,
                subSteps: []
              }
            ],
            component: Paso11ValoresObligatoriosComponent
          },
          {
            label: 'Mandato Especial de Administración de Valores',
            key: 'paso12',
            step: 7,
            completed: false,
            enabled: true,
            subSteps: [],
            component: Paso12MandatoEspecialComponent
          },
          {
            label: 'Pasivos',
            key: 'paso13',
            ste: 8,
            completed: false,
            enabled: true,
            subSteps: [
              {
                label: 'Deuda por pensión de alimentos',
                key: 'paso13-1',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Pasivos',
                key: 'paso13-2',
                completed: false,
                enabled: true,
                subSteps: []
              },
              {
                label: 'Individualización de cada deuda mayor a 100 UTM',
                key: 'paso13-3',
                completed: false,
                enabled: true,
                subSteps: []
              }
            ],
            component: Paso13PasivosComponent
          },
        ]
      }
    ]
  }

  /** Este es el objeto con los pasos y subpasos que deseas administrar. */
  stepsObj: StepData[] = [
    {
      label: 'Datos de la Declaración',
      key: 'paso1',
      completed: false,
      enabled: true,
      subSteps: [],
      component: Paso1DeclaracionComponent
    },
    {
      label: 'Datos Personales',
      key: 'paso2',
      completed: false,
      enabled: true,
      subSteps: [],
      component: Paso2DatosPersonalesComponent
    },
    {
      label: 'Datos de la Entidad',
      key: 'paso3',
      completed: false,
      enabled: true,
      subSteps: [],
      component: Paso3EntidadComponent
    },
    {
      label: 'Hijos bajo Patria Potestad',
      key: 'paso4',
      completed: false,
      enabled: false,
      subSteps: [],
      component: Paso4TutelaComponent
    },
    {
      label: 'Actividades',
      key: 'paso5',
      completed: false,
      enabled: true,
      subSteps: [
        {
          label: 'Actividades en que haya participado en los últimos 12 meses',
          key: 'paso5-1',
          completed: false,
          enabled: true,
          subSteps: []
        },
        {
          label: 'Actividades que realiza o en que participa a la fecha de la Declaración',
          key: 'paso5-2',
          completed: false,
          enabled: true,
          subSteps: []
        },
        {
          label: 'Actividades que realiza o participa el/la Cónyuge o Conviviente Civil',
          key: 'paso5-3',
          completed: false,
          enabled: true,
          subSteps: []
        }
      ],
      component: Paso5ActividadesComponent
    },
    {
      label: 'Bienes Inmuebles',
      key: 'paso6',
      completed: false,
      enabled: true,
      subSteps: [
        {
          label: 'Bien Inmueble Situado en Chile',
          key: 'paso6-1',
          completed: false,
          enabled: true,
          subSteps: []
        },
        {
          label: 'Bien Inmueble Situado en el Extranjero',
          key: 'paso6-2',
          completed: false,
          enabled: true,
          subSteps: []
        }
      ],
      component: Paso6BienesInmueblesComponent
    },
    {
      label: 'Derechos de Aprovechamiento de Aguas',
      key: 'paso7',
      completed: false,
      enabled: true,
      subSteps: [
        {
          label: 'Derecho de Aprovechamiento de Aguas',
          key: 'paso7-1',
          completed: false,
          enabled: true,
          subSteps: []
        },
        {
          label: 'Concesiones',
          key: 'paso7-2',
          completed: false,
          enabled: true,
          subSteps: []
        }
      ],
      component: Paso7DerechosAguasComponent
    },
    {
      label: 'Bienes Muebles Registrables',
      key: 'paso8',
      completed: false,
      enabled: true,
      subSteps: [
        {
          label: 'Vehículos Motorizados (Livianos y Pesados)',
          key: 'paso8-1',
          completed: false,
          enabled: true,
          subSteps: []
        },
        {
          label: 'Aeronaves',
          key: 'paso8-2',
          completed: false,
          enabled: true,
          subSteps: []
        },
        {
          label: 'Naves o Artefactos Navales',
          key: 'paso8-3',
          completed: false,
          enabled: true,
          subSteps: []
        },
        {
          label: 'Otros Bienes Muebles registrables',
          key: 'paso8-4',
          completed: false,
          enabled: true,
          subSteps: []
        }
      ],
      component: Paso8BienesMueblesComponent
    },
    {
      label: 'Derechos o Acciones en Entidades',
      key: 'paso9',
      completed: false,
      enabled: true,
      subSteps: [
        {
          label: 'Derechos o acciones en entidades constituidas en Chile',
          key: 'paso9-1',
          completed: false,
          enabled: true,
          subSteps: []
        },
        {
          label: 'Derechos o acciones en entidades constituidas en el Extranjero',
          key: 'paso9-2',
          completed: false,
          enabled: true,
          subSteps: []
        }
      ],
      component: Paso9DerechosAccionesComponent
    },
    {
      label: 'Valores (Instrumentos Financieros Transables)',
      key: 'paso10',
      completed: false,
      enabled: true,
      subSteps: [
        {
          label: 'Valores o Instrumentos transables en Chile',
          key: 'paso10-1',
          completed: false,
          enabled: true,
          subSteps: []
        },
        {
          label: 'Valores o Instrumentos transables en el Extranjero',
          key: 'paso10-2',
          completed: false,
          enabled: true,
          subSteps: []
        }
      ],
      component: Paso10ValoresComponent
    },
    {
      label: 'Valores Obligatorios Adicionales',
      key: 'paso11',
      completed: false,
      enabled: true,
      subSteps: [
        {
          label: 'Cuentas y/o Libretas de Ahorro',
          key: 'paso11-1',
          completed: false,
          enabled: true,
          subSteps: []
        },
        {
          label: 'Ahorro Previsional Voluntario',
          key: 'paso11-2',
          completed: false,
          enabled: true,
          subSteps: []
        },
        {
          label: 'Depósito a Plazo',
          key: 'paso11-3',
          completed: false,
          enabled: true,
          subSteps: []
        },
        {
          label: 'Seguros',
          key: 'paso11-4',
          completed: false,
          enabled: true,
          subSteps: []
        }
      ],
      component: Paso11ValoresObligatoriosComponent
    },
    {
      label: 'Mandato Especial de Administración de Valores',
      key: 'paso12',
      completed: false,
      enabled: true,
      subSteps: [],
      component: Paso12MandatoEspecialComponent
    },
    {
      label: 'Pasivos',
      key: 'paso13',
      completed: false,
      enabled: true,
      subSteps: [
        {
          label: 'Deuda por pensión de alimentos',
          key: 'paso13-1',
          completed: false,
          enabled: true,
          subSteps: []
        },
        {
          label: 'Pasivos',
          key: 'paso13-2',
          completed: false,
          enabled: true,
          subSteps: []
        },
        {
          label: 'Individualización de cada deuda mayor a 100 UTM',
          key: 'paso13-3',
          completed: false,
          enabled: true,
          subSteps: []
        }
      ],
      component: Paso13PasivosComponent
    },
    {
      label: 'Otra Fuente de Conflicto de Interés',
      key: 'paso14',
      completed: false,
      enabled: true,
      subSteps: [],
      component: Paso14FuenteConflictoComponent
    },
    {
      label: 'Otros Bienes Financieros y Físicos',
      key: 'paso15',
      completed: false,
      enabled: true,
      subSteps: [],
      component: Paso15OtrosBienesComponent
    },
    {
      label: 'Antecedentes Adicionales',
      key: 'paso16',
      completed: false,
      enabled: true,
      subSteps: [],
      component: Paso16AntecedentesComponent
    },
  ];

  /** Un FormGroup por cada paso de stepsObj (solo a modo de demo). */
  formGroups: FormGroup[] = [];

  /** Índice del step seleccionado en el stepper. */
  currentStepIndex = 0;

  /** Simula si es nueva declaración. */
  isNewDeclaration = true;

  /** Último paso habilitado/guardado (si fuese edición). */
  lastSavedStepIndex = 0;

  /** Porcentaje global de completitud (pasos + subpasos). */
  completionPercentage = 0;
  visitedSteps: boolean[] = [];                 /* nuevo */
  completion = 0;                         // %

  constructor(
    private fb: FormBuilder,
    public validadorService: ValidadorDeclaracionService
  ) { }

  ngOnInit(): void {
    // Cargamos stepsObj en el servicio
    this.validadorService.setSteps(this.stepsObj);
    this.formGroups = this.stepsObj.map(() => this.fb.group({ dummy: [''] }));
    this.visitedSteps = this.stepsObj.map((_) => false);
    this.visitedSteps[0] = true;                // primer paso activo

    /* actualiza % en tiempo real */
    this.validadorService.steps$.subscribe(() =>
      this.completionPercentage = this.validadorService.getCompletionPercentage()
    );
  }

  isVisited(idx: number): boolean { return this.visitedSteps[idx]; }


  /**
   * Llamado cuando el usuario hace clic en “Guardar/Siguiente”.
   * Marca el paso actual como completo o incompleto, según validez del form.
   */
  onClickGuardarPaso(i: number): void {
    const currentForm = this.formGroups[i];
    const stepKey = this.stepsObj[i].key;


    if (currentForm.valid && !this.validadorService.isComplete(stepKey)) {
      // Marcamos como completo
      this.validadorService.markComplete(stepKey);
      // Avanzamos al siguiente paso si no es el último
      if (i < this.stepsObj.length - 1) {
        this.lastSavedStepIndex = Math.max(this.lastSavedStepIndex, i + 1);
        this.currentStepIndex = i + 1;
      }
    } else {
      // Marcamos como incompleto
      this.validadorService.markIncomplete(stepKey);
    }
  }

  /**
   * Al pulsar “Finalizar” en el último paso, si todo (pasos y subpasos) está completo => enviar.
   */
  onFinalizar(): void {
    const i = this.stepsObj.length - 1;
    const currentForm = this.formGroups[i];
    const stepKey = this.stepsObj[i].key;

    if (currentForm.valid) {
      this.validadorService.markComplete(stepKey);
    } else {
      this.validadorService.markIncomplete(stepKey);
    }

    // Verificamos si todos los pasos+subpasos están completos
    const finalPercentage = this.validadorService.getCompletionPercentage();
    if (finalPercentage === 100) {
      this.validadorService.enviarDeclaracionFinal();
    } else {
      console.warn(
        'Aún hay pasos o subpasos incompletos. Porcentaje actual:',
        finalPercentage
      );
    }
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
