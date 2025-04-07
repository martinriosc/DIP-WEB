import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MinistroFeRoutingModule } from './ministro-fe-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MinistroFeListComponent } from './views/ministro-fe-list/ministro-fe-list.component';
@NgModule({
  declarations: [
  
    MinistroFeListComponent
  ],
  imports: [
    CommonModule,
    MinistroFeRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule

  ]
})
export class MinistroFeModule { }
