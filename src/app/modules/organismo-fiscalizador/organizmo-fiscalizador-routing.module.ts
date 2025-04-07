// usuario-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganismoFiscalizadorListComponent } from './views/organismo-fiscalizador-list/organismo-fiscalizador-list.component';

const routes: Routes = [
  { path: '', component:  OrganismoFiscalizadorListComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganismoFiscalizadorRoutingModule { }
