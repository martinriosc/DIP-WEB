import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule, NgComponentOutlet, NgForOf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepHeader, MatStepperModule } from '@angular/material/stepper';
import {  MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScrollingModule }   from '@angular/cdk/scrolling';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrModule } from 'ngx-toastr';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ResizableTableModule } from 'src/app/shared/components/resizable-table/resizable-table.module';
import { Ley19863ListComponent } from './views/ley-19863-list/ley-19863-list.component';
import { Ley19863RoutingModule } from './ley-19863-routing.module';

@NgModule({
  declarations: [
    Ley19863ListComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatRadioModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    Ley19863RoutingModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTabsModule,
    MatStepperModule,
    MatDialogModule,
    MatMenuModule,
    MatTooltipModule,
    ScrollingModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ResizableTableModule,
    ToastrModule.forRoot()
  ]
})
export class Ley19863Module { } 