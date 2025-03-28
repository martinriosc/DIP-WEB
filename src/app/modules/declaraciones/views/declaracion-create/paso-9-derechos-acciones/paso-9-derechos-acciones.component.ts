import { 
  Component, 
  OnInit, 
  ViewChild, 
  TemplateRef 
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// Interfaz para manejar los datos
export interface DerechoAccion {
  titulo: string;
  tipoCantidadPorcentaje: 'Cantidad' | 'Porcentaje';
  cantidadPorcentaje: number;
  razonSocial: string;
  rut: string;
  giro: string;
  fechaAdquisicion: string;  // O Date, según tu necesidad
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

  // Lista de derechos/acciones
  derechosAcciones: DerechoAccion[] = [];

  // Form para agregar / editar
  formDerechoAccion!: FormGroup;

  // Para saber si estamos editando
  isEditing = false;
  editIndex: number | null = null;

  // Para guardar la referencia del diálogo abierto
  dialogRef: MatDialogRef<any> | null = null;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formDerechoAccion = this.fb.group({
      titulo: ['', Validators.required],
      tipoCantidadPorcentaje: ['Cantidad', Validators.required],
      cantidadPorcentaje: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+$')],
      ],
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

  // Abre el diálogo de Material para agregar o editar
  openDialog(item?: DerechoAccion, index?: number): void {
    // Determina si estamos agregando o editando
    if (item !== undefined && index !== undefined) {
      this.isEditing = true;
      this.editIndex = index;
      this.formDerechoAccion.patchValue(item);
    } else {
      this.isEditing = false;
      this.editIndex = null;
      // Resetea el form a los valores por defecto
      this.formDerechoAccion.reset({
        tipoCantidadPorcentaje: 'Cantidad',
        tipoValor: 'Valor corriente',
        controlador: false
      });
    }

    // Abre el diálogo usando la plantilla local (#dialogTemplate)
    this.dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '800px',
      disableClose: true, // para obligar a usar los botones
    });
  }

  // Cierra el diálogo sin guardar
  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  // Guarda los cambios (Agregar o Editar) y cierra el diálogo
  saveDialog(): void {
    if (this.formDerechoAccion.invalid) {
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

    this.closeDialog();
  }

  // Eliminar un elemento de la tabla
  deleteItem(index: number): void {
    this.derechosAcciones.splice(index, 1);
  }
}
