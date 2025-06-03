import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { UsuariosComponent } from './views/usuarios/usuarios.component';
import { TextosComponent } from './views/textos/textos.component';
import { DeclaracionesComponent } from './views/declaraciones/declaraciones.component';
import { ReportesComponent } from './views/reportes/reportes.component';
import { AdministracionRoutingModule } from './administracion-routing.module';
import { TransparenciaActivaComponent } from './views/transparencia-activa/transparencia-activa.component';
import { TransparenciaActivaPendientesComponent } from './views/transparencia-activa/transparencia-activa-pendientes/transparencia-activa-pendientes.component';
import { TransparenciaActivaProcesadasComponent } from './views/transparencia-activa/transparencia-activa-procesadas/transparencia-activa-procesadas.component';
import { TransparenciaActivaPublicadasComponent } from './views/transparencia-activa/transparencia-activa-publicadas/transparencia-activa-publicadas.component';
import { TransparenciaActivaConErroresComponent } from './views/transparencia-activa/transparencia-activa-con-errores/transparencia-activa-con-errores.component';
import { AdministracionComponent } from './views/administracion/administracion.component';
import { ParametroServicioComponent } from './views/parametros/parametro-servicio/parametro-servicio.component';
import { ParametroUtmComponent } from './views/parametros/parametro-utm/parametro-utm.component';
import { ParametroMarcaVehiculoComponent } from './views/parametros/parametro-marca-vehiculo/parametro-marca-vehiculo.component';
import { ParametroTipoVehiculoComponent } from './views/parametros/parametro-tipo-vehiculo/parametro-tipo-vehiculo.component';
import { ParametroProfesionComponent } from './views/parametros/parametro-profesion/parametro-profesion.component';
import { ParametroActividadComponent } from './views/parametros/parametro-actividad/parametro-actividad.component';
import { ParametroPdfReservadoComponent } from './views/parametros/parametro-pdf-reservado/parametro-pdf-reservado.component';
import { ParametroJsonReservadoComponent } from './views/parametros/parametro-json-reservado/parametro-json-reservado.component';
import { ParametroConfiguracionComponent } from './views/parametros/parametro-configuracion/parametro-configuracion.component';


@NgModule({
  declarations: [
    UsuariosComponent,
    TextosComponent,
    DeclaracionesComponent,
    ReportesComponent,
    TransparenciaActivaComponent,
    TransparenciaActivaPendientesComponent,
    TransparenciaActivaProcesadasComponent,
    TransparenciaActivaPublicadasComponent,
    TransparenciaActivaConErroresComponent,
    AdministracionComponent,
    ParametroServicioComponent,
    ParametroUtmComponent,
    ParametroMarcaVehiculoComponent,
    ParametroTipoVehiculoComponent,
    ParametroProfesionComponent,
    ParametroActividadComponent,
    ParametroPdfReservadoComponent,
    ParametroJsonReservadoComponent,
    ParametroConfiguracionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdministracionRoutingModule,
    // Material
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports: [
    // Exporta los componentes si quieres usarlos fuera de este módulo
    UsuariosComponent,
    TextosComponent,
    DeclaracionesComponent,
    ReportesComponent
  ]
})
export class AdministracionModule {}
