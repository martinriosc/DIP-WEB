import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './modules/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: 'usuario',
    loadChildren: () =>
      import('./modules/usuario/usuario.module').then(m => m.UsuarioModule),
    canActivate: [authGuard]
  },
  {
    path: 'inicio',
    loadChildren: () =>
      import('./modules/inicio/inicio.module').then(m => m.InicioModule),
    canActivate: [authGuard]
  },
  {
    path: 'declaraciones',
    loadChildren: () =>
      import('./modules/declaraciones/declaraciones.module').then(m => m.DeclaracionesModule),
    canActivate: [authGuard]
  },
  {
    path: 'revisor',
    loadChildren: () =>
      import('./modules/revisor/revisor.module').then(m => m.RevisorModule),
    canActivate: [authGuard]
  },

  {
    path: 'ministro-fe',
    loadChildren: () =>
      import('./modules/ministro-fe/ministro-fe.module').then(m => m.MinistroFeModule),
    canActivate: [authGuard]
  },
  {
    path: 'jefe-servicio',
    loadChildren: () =>
      import('./modules/jefe-servicio/jefe-servicio.module').then(m => m.JefeServicioModule),
    canActivate: [authGuard]
  },
  {
    path: 'administracion',
    loadChildren: () =>
      import('./modules/administracion/administracion.module').then(m => m.AdministracionModule),
    canActivate: [authGuard]
  },
  {
    path: 'organismo-fiscalizador',
    loadChildren: () =>
      import('./modules/organismo-fiscalizador/organismo-fiscalizador.module').then(m => m.OrganismoFiscalizadorModule),
    canActivate: [authGuard]
  },
  {
    path: 'transparencia-pasiva',
    loadChildren: () =>
      import('./modules/transparencia-pasiva/transparencia-pasiva.module').then(m => m.TransparenciaPasivaModule),
    canActivate: [authGuard]
  },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
