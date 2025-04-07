import { 
  Component, 
  OnInit, 
  ViewChild, 
  TemplateRef 
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ValidadorDeclaracionService } from '../../../services/validador-declaracion.service';


export interface DerechoAccion {
  titulo: string;
  tipoCantidadPorcentaje: 'Cantidad' | 'Porcentaje';
  cantidadPorcentaje: number;
  razonSocial: string;
  rut: string;
  giro: string;
  fechaAdquisicion: string;
  tipoValor: 'Valor corriente' | 'Valor libro';
  valor: number;
  gravamenes: string;
  controlador: boolean;
}

@Component({
  selector: 'app-paso-9-derechos-acciones',
  templateUrl: './paso-9-derechos-acciones.component.html',
  styleUrls: ['./paso-9-derechos-acciones.component.scss']
})
export class Paso9DerechosAccionesComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  derechosAcciones: DerechoAccion[] = [];
  formDerechoAccion!: FormGroup;
  isEditing = false;
  editIndex: number | null = null;
  dialogRef: MatDialogRef<any> | null = null;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private validadorDeclaracionService: ValidadorDeclaracionService
  ) {}

  ngOnInit(): void {
    this.initForm();
    // Opcional: Si no hay datos iniciales, marca como incompleto
    this.validadorDeclaracionService.setPasoCompleto('paso9', false);
  }

  initForm() {
    this.formDerechoAccion = this.fb.group({
      titulo: ['', Validators.required],
      tipoCantidadPorcentaje: ['Cantidad', Validators.required],
      cantidadPorcentaje: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      razonSocial: ['', Validators.required],
      rut: ['', Validators.required],
      giro: [''],
      fechaAdquisicion: [''],
      tipoValor: ['Valor corriente', Validators.required],
      valor: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      gravamenes: [''],
      controlador: [false, Validators.required],
    });
  }

  openDialog(item?: DerechoAccion, index?: number): void {
    if (item !== undefined && index !== undefined) {
      this.isEditing = true;
      this.editIndex = index;
      this.formDerechoAccion.patchValue(item);
    } else {
      this.isEditing = false;
      this.editIndex = null;
      this.formDerechoAccion.reset({
        tipoCantidadPorcentaje: 'Cantidad',
        tipoValor: 'Valor corriente',
        controlador: false
      });
    }

    this.dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '800px',
      disableClose: true,
    });
  }

  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  saveDialog(): void {
    if (this.formDerechoAccion.invalid) {
      // Marca incompleto si no valida
      this.validadorDeclaracionService.setPasoCompleto('paso9', false);
      return;
    }

    const formValue = this.formDerechoAccion.value as DerechoAccion;

    if (!this.isEditing) {
      // Agregar
      this.derechosAcciones.push(formValue);
    } else if (this.editIndex !== null) {
      // Editar
      this.derechosAcciones[this.editIndex] = formValue;
    }

    // Si hay al menos un registro, marcamos como completo
    this.validadorDeclaracionService.setPasoCompleto('paso9', this.derechosAcciones.length > 0);
    this.closeDialog();
  }

  deleteItem(index: number): void {
    this.derechosAcciones.splice(index, 1);
    // Actualizar si queda vacío
    this.validadorDeclaracionService.setPasoCompleto('paso9', this.derechosAcciones.length > 0);
  }
}
