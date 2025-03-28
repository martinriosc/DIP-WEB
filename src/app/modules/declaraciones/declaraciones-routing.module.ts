// usuario-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeclaracionListComponent } from './views/declaracion-list/declaracion-list.component';
import { DeclaracionCreateComponent } from './views/declaracion-create/declaracion-create.component';

const routes: Routes = [
  { path: '', component:  DeclaracionListComponent},
  { path: 'nueva', component:  DeclaracionCreateComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeclaracionesRoutingModule { }
