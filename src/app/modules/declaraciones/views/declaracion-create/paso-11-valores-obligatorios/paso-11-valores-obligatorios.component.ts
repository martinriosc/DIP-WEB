import { Component, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ValidadorDeclaracionService } from '../../../services/validador-declaracion.service';

interface ValorObligatorio {
  tipoDocumento: string;
  nroDocumento: string;
  valor: number;
  fechaEmision: string;
}

@Component({
  selector: 'app-paso-11-valores-obligatorios',
  templateUrl: './paso-11-valores-obligatorios.component.html',
  styleUrls: ['./paso-11-valores-obligatorios.component.scss']
})
export class Paso11ValoresObligatoriosComponent {
  tieneValoresObligatorios = 'no';
  valoresObligatoriosData: ValorObligatorio[] = [
    { tipoDocumento: 'PAGARE', nroDocumento: 'ABC-123', valor: 500000, fechaEmision: '2023-01-10' }
  ];

  @ViewChild('valObligModal') valObligModal!: TemplateRef<any>;
  valObligForm!: FormGroup;
  editMode = false;
  currentItem: ValorObligatorio | null = null;
  valObligatoriosData: ValorObligatorio[] = [];
  
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private validadorDeclaracionService: ValidadorDeclaracionService
  ) {
    // Marca el paso como completo si la data inicial no está vacía
    this.validadorDeclaracionService.setPasoCompleto('paso11', this.valoresObligatoriosData.length > 0);
  }

  openAddModal() {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.dialog.open(this.valObligModal);
  }

  openEditModal(vo: ValorObligatorio) {
    this.editMode = true;
    this.currentItem = vo;
    this.buildForm(vo);
    this.dialog.open(this.valObligModal);
  }

  buildForm(vo?: ValorObligatorio) {
    this.valObligForm = this.fb.group({
      tipoDocumento: [vo?.tipoDocumento || 'PAGARE'],
      nroDocumento: [vo?.nroDocumento || ''],
      valor: [vo?.valor || 0],
      fechaEmision: [vo?.fechaEmision || '']
    });
  }

  saveValorOblig(dialogRef: any) {
    if (this.valObligForm.invalid) {
      this.validadorDeclaracionService.setPasoCompleto('paso11', false);
      return;
    }

    const formValue = this.valObligForm.value as ValorObligatorio;
    if (this.editMode && this.currentItem) {
      const i = this.valoresObligatoriosData.indexOf(this.currentItem);
      if (i >= 0) {
        this.valoresObligatoriosData[i] = formValue;
      }
    } else {
      this.valObligatoriosData.push(formValue);
    }
    dialogRef.close();

    // Marcar paso como completo si la tabla no está vacía
    this.validadorDeclaracionService.setPasoCompleto('paso11', this.valoresObligatoriosData.length > 0);
  }

  eliminarValor(vo: ValorObligatorio) {
    this.valObligatoriosData = this.valObligatoriosData.filter(x => x !== vo);
    // Si se vacía => incompleto
    this.validadorDeclaracionService.setPasoCompleto('paso11', this.valObligatoriosData.length > 0);
  }

  onTieneValoresObligChange(value: string) {
    this.tieneValoresObligatorios = value;
    // Manejas la lógica: si "no", set incompleto
    if (value === 'no') {
      this.validadorDeclaracionService.setPasoCompleto('paso11', false);
    } else {
      // "si"
      this.validadorDeclaracionService.setPasoCompleto('paso11', this.valObligatoriosData.length > 0);
    }
  }
}
