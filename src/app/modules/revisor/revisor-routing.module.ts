// usuario-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevisorListComponent } from './views/revisor-list/revisor-list.component';

const routes: Routes = [
  { path: '', component:  RevisorListComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevisorRoutingModule { }
