// usuario-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeclaracionListComponent } from './views/declaracion-list/declaracion-list.component';
import { DeclaracionDetalleComponent } from './views/declaracion-detalle/declaracion-detalle.component';

const routes: Routes = [
  { path: '', component:  DeclaracionListComponent},
  { path: 'detalle', component:  DeclaracionDetalleComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeclaracionesRoutingModule { }
