import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { OrganismoFiscalizadorRoutingModule } from './organizmo-fiscalizador-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { OrganismoFiscalizadorListComponent } from './views/organismo-fiscalizador-list/organismo-fiscalizador-list.component';
@NgModule({
  declarations: [
  
    OrganismoFiscalizadorListComponent
  ],
  imports: [
    CommonModule,
    OrganismoFiscalizadorRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule

  ]
})
export class OrganismoFiscalizadorModule { }
