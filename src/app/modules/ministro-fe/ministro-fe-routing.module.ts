// usuario-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MinistroFeListComponent } from './views/ministro-fe-list/ministro-fe-list.component';

const routes: Routes = [
  { path: '', component:  MinistroFeListComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MinistroFeRoutingModule { }
