import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RevisorRoutingModule } from './revisor-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { RevisorListComponent } from './views/revisor-list/revisor-list.component';
@NgModule({
  declarations: [
  
    RevisorListComponent
  ],
  imports: [
    CommonModule,
    RevisorRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule

  ]
})
export class RevisorModule { }
