import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ley19863ListComponent } from './views/ley-19863-list/ley-19863-list.component';

const routes: Routes = [
  { path: '', component: Ley19863ListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Ley19863RoutingModule { } 