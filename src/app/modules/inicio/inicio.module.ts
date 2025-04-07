import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './views/inicio/inicio.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { InicioRoutingModule } from './inicio-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
@NgModule({
  declarations: [

    InicioComponent
  ],
  imports: [
    CommonModule,
    InicioRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule

  ]
})
export class InicioModule { }
