import { Component, ViewChild, TemplateRef, Optional, SkipSelf } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ValidadorDeclaracionService } from '../../../../services/validador-declaracion.service';
import { MatStepper } from '@angular/material/stepper';

interface ValorItem {
  tipoValor: string;
  emisor: string;
  cantidad: number;
  valorAproximado: number;
}

@Component({
  selector: 'app-paso-10-valores',
  templateUrl: './paso-10-valores.component.html',
  styleUrls: ['./paso-10-valores.component.scss']
})
export class Paso10ValoresComponent {
  tieneValores = 'no';

  valoresData: ValorItem[] = [
    { tipoValor: 'BONO', emisor: 'Banco XYZ', cantidad: 100, valorAproximado: 500000 }
  ];

  @ViewChild('valorModal') valorModal!: TemplateRef<any>;
  valorForm!: FormGroup;
  editMode = false;
  currentItem: ValorItem | null = null;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private validadorDeclaracionService: ValidadorDeclaracionService,
    @Optional() @SkipSelf() private stepper?: MatStepper
  ) {
  }

  onSubmit(): void {
    const ok = (this.valoresData.length > 0 && this.tieneValores) || !this.tieneValores;
    const key = 'paso10';

    ok ? this.validadorDeclaracionService.markComplete(key)
      : this.validadorDeclaracionService.markIncomplete(key);

    if (ok && this.stepper) {
      this.stepper.next();
    }
  }

  openAddModal() {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.dialog.open(this.valorModal);
  }

  openEditModal(item: ValorItem) {
    this.editMode = true;
    this.currentItem = item;
    this.buildForm(item);
    this.dialog.open(this.valorModal);
  }

  buildForm(item?: ValorItem) {
    this.valorForm = this.fb.group({
      tipoValor: [item?.tipoValor || 'BONO'],
      emisor: [item?.emisor || ''],
      cantidad: [item?.cantidad || 0],
      valorAproximado: [item?.valorAproximado || 0]
    });
  }

  saveValor(dialogRef: any) {
    if (this.valorForm.invalid) {
      this.validadorDeclaracionService.setPasoCompleto('paso10', false);
      return;
    }

    const formValue = this.valorForm.value as ValorItem;
    if (this.editMode && this.currentItem) {
      const i = this.valoresData.indexOf(this.currentItem);
      if (i >= 0) {
        this.valoresData[i] = formValue;
      }
    } else {
      this.valoresData.push(formValue);
    }
    dialogRef.close();

    // Marcar como completo si hay datos
    this.validadorDeclaracionService.setPasoCompleto('paso10', this.valoresData.length > 0);
  }

  eliminarValor(v: ValorItem) {
    this.valoresData = this.valoresData.filter(x => x !== v);
    // Si se vacía, marcar como incompleto
    this.validadorDeclaracionService.setPasoCompleto('paso10', this.valoresData.length > 0);
  }

  // Cambios en el radio
  onTieneValoresChange(value: string) {
    this.tieneValores = value;
    // Si marca "no", vaciar o no la lista, pero marcar incompleto
    if (value === 'no') {
      // this.valoresData = [];
      this.validadorDeclaracionService.setPasoCompleto('paso10', false);
    } else {
      // "si"
      // Si ya había datos => completo, sino => incompleto
      this.validadorDeclaracionService.setPasoCompleto('paso10', this.valoresData.length > 0);
    }
  }
}
