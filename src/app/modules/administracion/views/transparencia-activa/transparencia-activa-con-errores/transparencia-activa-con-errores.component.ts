import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

interface ErrorTransparencia {
  id: number;
  rutDeclarante: string;
  fechaError: string;
  tipo: string;
  descripcion: string;
}

@Component({
  selector: 'app-transparencia-activa-con-errores',
  templateUrl: './transparencia-activa-con-errores.component.html',
  styleUrls: ['./transparencia-activa-con-errores.component.scss']
})
export class TransparenciaActivaConErroresComponent implements OnInit {

  displayedColumns: string[] = ['id', 'rutDeclarante', 'fechaError', 'tipo', 'descripcion', 'acciones'];
  dataSource: ErrorTransparencia[] = [];

  @ViewChild('erroresModal') erroresModalTemplate!: TemplateRef<any>;

  formError!: FormGroup;
  editMode = false;
  private currentEditId: number | null = null;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.dataSource = [
      { id: 100, rutDeclarante: '55.555.555-5', fechaError: '2025-04-25', tipo: 'Voluntaria', descripcion: 'Campo vacio...' }
    ];
  }

  crearError() {
    this.editMode = false;
    this.currentEditId = null;
    this.formError = this.fb.group({
      rutDeclarante: [''],
      fechaError: [''],
      tipo: [''],
      descripcion: ['']
    });
    this.dialog.open(this.erroresModalTemplate, { width: '600px' });
  }

  editarError(item: ErrorTransparencia) {
    this.editMode = true;
    this.currentEditId = item.id;
    this.formError = this.fb.group({
      rutDeclarante: [item.rutDeclarante],
      fechaError: [item.fechaError],
      tipo: [item.tipo],
      descripcion: [item.descripcion]
    });
    this.dialog.open(this.erroresModalTemplate, { width: '600px' });
  }

  eliminarError(item: ErrorTransparencia) {
    if (confirm(`¿Eliminar el error con RUT "${item.rutDeclarante}"?`)) {
      this.dataSource = this.dataSource.filter(d => d.id !== item.id);
    }
  }

  guardar() {
    const val = this.formError.value;
    if (!this.editMode) {
      const newId = this.dataSource.length > 0
        ? Math.max(...this.dataSource.map(d => d.id)) + 1
        : 1;
      this.dataSource.push({
        id: newId,
        ...val
      });
    } else {
      const i = this.dataSource.findIndex(d => d.id === this.currentEditId);
      if (i >= 0) {
        this.dataSource[i] = {
          id: this.currentEditId!,
          ...val
        };
      }
    }
    this.dataSource = [...this.dataSource];
    this.dialog.closeAll();
  }

  cerrarModal() {
    this.dialog.closeAll();
  }
}
