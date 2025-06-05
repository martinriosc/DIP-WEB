import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteListComponent } from './views/reporte-list/reporte-list.component';

const routes: Routes = [
  { path: '', component: ReporteListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteRoutingModule { } 