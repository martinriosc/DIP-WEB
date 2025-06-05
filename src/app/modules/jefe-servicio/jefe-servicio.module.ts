import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { JefeServicioRoutingModule } from './jefe-servicio-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { JefeServicioEnviadasComponent } from './views/jefe-servicio-enviadas/jefe-servicio-enviadas.component';
import { JefeServicioArchivoMasivoComponent } from './views/jefe-servicio-archivo-masivo/jefe-servicio-archivo-masivo.component';
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
import { JefeServicioListComponent } from './views/jefe-servicio-list/jefe-servicio-list.component';
import { JefeServicioPendientesComponent } from './views/jefe-servicio-pendientes/jefe-servicio-pendientes.component';
import { JefeServicioArchivadasComponent } from './views/jefe-servicio-archivadas/jefe-servicio-archivadas.component';
import { JefeServicioFirmaEnvioComponent } from './views/jefe-servicio-firma-envio/jefe-servicio-firma-envio.component';

@NgModule({
  declarations: [
    JefeServicioListComponent,
    JefeServicioPendientesComponent,
    JefeServicioFirmaEnvioComponent,
    JefeServicioEnviadasComponent,
    JefeServicioArchivoMasivoComponent,
    JefeServicioArchivadasComponent
  
  ],
  imports: [
    CommonModule,
    JefeServicioRoutingModule,
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
    MatTooltipModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
  ]
})
export class JefeServicioModule { } 