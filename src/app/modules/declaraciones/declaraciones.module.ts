import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule, NgComponentOutlet, NgForOf } from '@angular/common';
import { DeclaracionListComponent } from './views/declaracion-list/declaracion-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { DeclaracionesRoutingModule } from './declaraciones-routing.module';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DeclaracionDetalleComponent } from './views/declaracion-detalle/declaracion-detalle.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepHeader, MatStepperModule } from '@angular/material/stepper';
import { Paso1DeclaracionComponent } from './views/declaracion-detalle/antecedentes-declarante/paso-1-declaracion/paso-1-declaracion.component';
import { Paso2DatosPersonalesComponent } from './views/declaracion-detalle/antecedentes-declarante/paso-2-datos-personales/paso-2-datos-personales.component';
import { Paso3EntidadComponent } from './views/declaracion-detalle/antecedentes-declarante/paso-3-entidad/paso-3-entidad.component';
import { Paso4TutelaComponent } from './views/declaracion-detalle/antecedentes-declarante/paso-4-tutela/paso-4-tutela.component';
import { Paso5ActividadesComponent } from './views/declaracion-detalle/intereses-y-patrimonios/paso-5-actividades/paso-5-actividades.component';
import { Paso6BienesInmueblesComponent } from './views/declaracion-detalle/intereses-y-patrimonios/paso-6-bienes-inmuebles/paso-6-bienes-inmuebles.component';
import { Paso7DerechosAguasComponent } from './views/declaracion-detalle/intereses-y-patrimonios/paso-7-derechos-aguas/paso-7-derechos-aguas.component';
import { Paso8BienesMueblesComponent } from './views/declaracion-detalle/intereses-y-patrimonios/paso-8-bienes-muebles/paso-8-bienes-muebles.component';
import { Paso9DerechosAccionesComponent } from './views/declaracion-detalle/intereses-y-patrimonios/paso-9-derechos-acciones/paso-9-derechos-acciones.component';
import { Paso10ValoresComponent } from './views/declaracion-detalle/intereses-y-patrimonios/paso-10-valores/paso-10-valores.component';
import { Paso11ValoresObligatoriosComponent } from './views/declaracion-detalle/intereses-y-patrimonios/paso-11-valores-obligatorios/paso-11-valores-obligatorios.component';
import { Paso12MandatoEspecialComponent } from './views/declaracion-detalle/intereses-y-patrimonios/paso-12-mandato-especial/paso-12-mandato-especial.component';
import { Paso13PasivosComponent } from './views/declaracion-detalle/intereses-y-patrimonios/paso-13-pasivos/paso-13-pasivos.component';
import { Paso14FuenteConflictoComponent } from './views/declaracion-detalle/intereses-y-patrimonios/paso-14-fuente-conflicto/paso-14-fuente-conflicto.component';
import { Paso15OtrosBienesComponent } from './views/declaracion-detalle/intereses-y-patrimonios/paso-15-otros-bienes/paso-15-otros-bienes.component';
import { Paso16AntecedentesComponent } from './views/declaracion-detalle/intereses-y-patrimonios/paso-16-antecedentes/paso-16-antecedentes.component';
import {  MatDialogModule } from '@angular/material/dialog';
import { ConfirmacionDatosComponent } from './views/declaracion-detalle/confirmacion-datos/confirmacion-datos.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeHtmlPipe } from './pipe/safe-html.pipe';
import { AntecedentesDeclaranteComponent } from './views/declaracion-detalle/antecedentes-declarante/antecedentes-declarante.component';
import { InteresesYPatrimoniosComponent } from './views/declaracion-detalle/intereses-y-patrimonios/intereses-y-patrimonios.component';
import { ScrollingModule }   from '@angular/cdk/scrolling';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DipStepperComponent } from './components/dip-stepper/dip-stepper.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrModule } from 'ngx-toastr';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ResizableTableModule } from 'src/app/shared/components/resizable-table/resizable-table.module';

@NgModule({
  declarations: [
    DeclaracionListComponent,
    DeclaracionDetalleComponent,
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
    Paso16AntecedentesComponent,
    ConfirmacionDatosComponent,
    SafeHtmlPipe,
    AntecedentesDeclaranteComponent,
    InteresesYPatrimoniosComponent,
    DipStepperComponent
    
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatRadioModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    DeclaracionesRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTabsModule,
    MatStepperModule,
    MatDialogModule,
    MatMenuModule,
    MatTooltipModule,
    ScrollingModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ResizableTableModule,
    ToastrModule.forRoot()
  ]
})
export class DeclaracionesModule { }
