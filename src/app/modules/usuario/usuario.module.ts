// usuario.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioListComponent } from './views/usuario-list/usuario-list.component';

@NgModule({
  declarations: [
    // Otros componentes, directivas, pipes específicos de usuario
  
    UsuarioListComponent
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule
  ]
})
export class UsuarioModule { }
