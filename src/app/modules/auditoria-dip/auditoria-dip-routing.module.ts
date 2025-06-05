import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditoriaDipListComponent } from './views/auditoria-dip-list/auditoria-dip-list.component';

const routes: Routes = [
  { path: '', component: AuditoriaDipListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditoriaDipRoutingModule { } 