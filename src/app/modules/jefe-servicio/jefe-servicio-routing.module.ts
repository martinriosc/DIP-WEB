// jefe-servicio-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JefeServicioListComponent } from './views/jefe-servicio-list/jefe-servicio-list.component';

const routes: Routes = [
  { path: '', component:  JefeServicioListComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JefeServicioRoutingModule { } 