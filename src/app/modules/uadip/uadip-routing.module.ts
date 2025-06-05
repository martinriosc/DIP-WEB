import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UadipListComponent } from './views/uadip-list/uadip-list.component';

const routes: Routes = [
  { path: '', component: UadipListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UadipRoutingModule { } 