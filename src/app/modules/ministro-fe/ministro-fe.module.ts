import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MinistroFeRoutingModule } from './ministro-fe-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MinistroFeListComponent } from './views/ministro-fe-list/ministro-fe-list.component';
import { MinistroFePendientesComponent } from './views/ministro-fe-pendientes/ministro-fe-pendientes.component';
import { MinistroFeEnviadasComponent } from './views/ministro-fe-enviadas/ministro-fe-enviadas.component';
import { MinistroFeArchivadasComponent } from './views/ministro-fe-archivadas/ministro-fe-archivadas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    MinistroFeListComponent,
    MinistroFePendientesComponent,
    MinistroFeEnviadasComponent,
    MinistroFeArchivadasComponent
  ],
  imports: [
    CommonModule,
    MinistroFeRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatRadioModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTabsModule,
    MatStepperModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatTooltipModule
  ]
})
export class MinistroFeModule { }
