// usuario-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from './views/usuarios/usuarios.component';
import { AdministracionComponent } from './views/administracion/administracion.component';
import { DeclaracionesComponent } from './views/declaraciones/declaraciones.component';
import { ParametroActividadComponent } from './views/parametros/parametro-actividad/parametro-actividad.component';
import { ParametroConfiguracionComponent } from './views/parametros/parametro-configuracion/parametro-configuracion.component';
import { ParametroJsonReservadoComponent } from './views/parametros/parametro-json-reservado/parametro-json-reservado.component';
import { ParametroMarcaVehiculoComponent } from './views/parametros/parametro-marca-vehiculo/parametro-marca-vehiculo.component';
import { ParametroPdfReservadoComponent } from './views/parametros/parametro-pdf-reservado/parametro-pdf-reservado.component';
import { ParametroProfesionComponent } from './views/parametros/parametro-profesion/parametro-profesion.component';
import { ParametroServicioComponent } from './views/parametros/parametro-servicio/parametro-servicio.component';
import { ParametroTipoVehiculoComponent } from './views/parametros/parametro-tipo-vehiculo/parametro-tipo-vehiculo.component';
import { ParametroUtmComponent } from './views/parametros/parametro-utm/parametro-utm.component';
import { ReportesComponent } from './views/reportes/reportes.component';
import { TextosComponent } from './views/textos/textos.component';
import { TransparenciaActivaConErroresComponent } from './views/transparencia-activa/transparencia-activa-con-errores/transparencia-activa-con-errores.component';
import { TransparenciaActivaPendientesComponent } from './views/transparencia-activa/transparencia-activa-pendientes/transparencia-activa-pendientes.component';
import { TransparenciaActivaProcesadasComponent } from './views/transparencia-activa/transparencia-activa-procesadas/transparencia-activa-procesadas.component';
import { TransparenciaActivaPublicadasComponent } from './views/transparencia-activa/transparencia-activa-publicadas/transparencia-activa-publicadas.component';

const routes: Routes = [
  {
  path: '',
  component: AdministracionComponent,
  children: [
    // Rutas principales
    { path: 'usuarios', component: UsuariosComponent },
    {
      path: 'parametros',
      children: [
        { path: 'servicio', component: ParametroServicioComponent },
        { path: 'utm', component: ParametroUtmComponent },
        { path: 'marca-vehiculo', component: ParametroMarcaVehiculoComponent },
        { path: 'tipo-vehiculo', component: ParametroTipoVehiculoComponent },
        { path: 'profesion', component: ParametroProfesionComponent },
        { path: 'actividad', component: ParametroActividadComponent },
        { path: 'pdf-reservado', component: ParametroPdfReservadoComponent },
        { path: 'json-reservado', component: ParametroJsonReservadoComponent },
        { path: 'configuracion', component: ParametroConfiguracionComponent },
        // ...
      ]
    },
    { path: 'textos', component: TextosComponent },
    { path: 'declaraciones', component: DeclaracionesComponent },
    {
      path: 'transparencia-activa',
      children: [
        { path: 'pendientes', component: TransparenciaActivaPendientesComponent },
        { path: 'procesadas', component: TransparenciaActivaProcesadasComponent },
        { path: 'publicadas', component: TransparenciaActivaPublicadasComponent },
        { path: 'con-errores', component: TransparenciaActivaConErroresComponent },
        // ...
      ]
    },
    { path: 'reportes', component: ReportesComponent },

    { path: '', redirectTo: 'usuarios', pathMatch: 'full' }
  ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
