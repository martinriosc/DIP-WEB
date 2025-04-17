import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

interface PendienteTransparencia {
  id: number;
  rutDeclarante: string;
  fecha: string;
  tipo: string;
  estado: string;
}

@Component({
  selector: 'app-transparencia-activa-pendientes',
  templateUrl: './transparencia-activa-pendientes.component.html',
  styleUrls: ['./transparencia-activa-pendientes.component.scss']
})
export class TransparenciaActivaPendientesComponent implements OnInit {

  displayedColumns: string[] = ['id', 'rutDeclarante', 'fecha', 'tipo', 'estado', 'acciones'];
  dataSource: PendienteTransparencia[] = [];

  @ViewChild('pendientesModal') pendientesModalTemplate!: TemplateRef<any>;

  formPendiente!: FormGroup;
  editMode = false;
  private currentEditId: number | null = null;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Carga inicial de data
    this.dataSource = [
      { id: 1, rutDeclarante: '11.111.111-1', fecha: '2025-04-10', tipo: 'Periódica', estado: 'Pendiente' },
      { id: 2, rutDeclarante: '22.222.222-2', fecha: '2025-04-12', tipo: 'Primera', estado: 'Pendiente' }
    ];
  }

  crearPendiente() {
    this.editMode = false;
    this.currentEditId = null;
    this.formPendiente = this.fb.group({
      rutDeclarante: [''],
      fecha: [''],
      tipo: [''],
      estado: ['']
    });
    this.dialog.open(this.pendientesModalTemplate, { width: '600px' });
  }

  editarPendiente(item: PendienteTransparencia) {
    this.editMode = true;
    this.currentEditId = item.id;
    this.formPendiente = this.fb.group({
      rutDeclarante: [item.rutDeclarante],
      fecha: [item.fecha],
      tipo: [item.tipo],
      estado: [item.estado]
    });
    this.dialog.open(this.pendientesModalTemplate, { width: '600px' });
  }

  eliminarPendiente(item: PendienteTransparencia) {
    if (confirm(`¿Eliminar la pendiente con RUT "${item.rutDeclarante}"?`)) {
      this.dataSource = this.dataSource.filter(d => d.id !== item.id);
    }
  }

  guardar() {
    const val = this.formPendiente.value;
    if (!this.editMode) {
      // Crear
      const newId = this.dataSource.length > 0
        ? Math.max(...this.dataSource.map(d => d.id)) + 1
        : 1;
      this.dataSource.push({
        id: newId,
        ...val
      });
    } else {
      // Editar
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
