import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AdministracionRoutingModule } from './administracion-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { UsuariosComponent } from './views/usuarios/usuarios.component';
import { ParametrosComponent } from './views/parametros/parametros.component';
import { TextosComponent } from './views/textos/textos.component';
import { DeclaracionesComponent } from './views/declaraciones/declaraciones.component';
import { TransparenciaActivaComponent } from './views/transparencia-activa/transparencia-activa.component';
import { ReportesComponent } from './views/reportes/reportes.component';
@NgModule({
  declarations: [
  
    UsuariosComponent,
       ParametrosComponent,
       TextosComponent,
       DeclaracionesComponent,
       TransparenciaActivaComponent,
       ReportesComponent
  ],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule

  ]
})
export class AdministracionModule { }
