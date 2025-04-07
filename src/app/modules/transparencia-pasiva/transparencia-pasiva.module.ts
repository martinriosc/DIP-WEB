import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { TransparenciaPasivaRoutingModule } from './transparencia-pasiva-routing.module';
import { TransparenciaPasivaListComponent } from './views/transparencia-pasiva-list/transparencia-pasiva-list.component';
@NgModule({
  declarations: [
  
    TransparenciaPasivaListComponent
  ],
  imports: [
    CommonModule,
    TransparenciaPasivaRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule

  ]
})
export class TransparenciaPasivaModule { }
