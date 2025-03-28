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
    path: 'declaraciones',
    loadChildren: () =>
      import('./modules/declaraciones/declaraciones.module').then(m => m.DeclaracionesModule),
    canActivate: [authGuard]
  },
  { path: '', redirectTo: 'usuario', pathMatch: 'full' },
  { path: '**', redirectTo: 'usuario' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
