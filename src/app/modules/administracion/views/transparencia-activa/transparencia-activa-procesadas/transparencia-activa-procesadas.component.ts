import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

interface ProcesadaTransparencia {
  id: number;
  rutDeclarante: string;
  fechaProcesada: string;
  tipo: string;
  estado: string;
}

@Component({
  selector: 'app-transparencia-activa-procesadas',
  templateUrl: './transparencia-activa-procesadas.component.html',
  styleUrls: ['./transparencia-activa-procesadas.component.scss']
})
export class TransparenciaActivaProcesadasComponent implements OnInit {

  displayedColumns: string[] = ['id', 'rutDeclarante', 'fechaProcesada', 'tipo', 'estado', 'acciones'];
  dataSource: ProcesadaTransparencia[] = [];

  @ViewChild('procesadasModal') procesadasModalTemplate!: TemplateRef<any>;

  formProcesada!: FormGroup;
  editMode = false;
  private currentEditId: number | null = null;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.dataSource = [
      { id: 1, rutDeclarante: '33.333.333-3', fechaProcesada: '2025-04-15', tipo: 'Actualización', estado: 'Procesada' }
    ];
  }

  crearProcesada() {
    this.editMode = false;
    this.currentEditId = null;
    this.formProcesada = this.fb.group({
      rutDeclarante: [''],
      fechaProcesada: [''],
      tipo: [''],
      estado: ['']
    });
    this.dialog.open(this.procesadasModalTemplate, { width: '600px' });
  }

  editarProcesada(item: ProcesadaTransparencia) {
    this.editMode = true;
    this.currentEditId = item.id;
    this.formProcesada = this.fb.group({
      rutDeclarante: [item.rutDeclarante],
      fechaProcesada: [item.fechaProcesada],
      tipo: [item.tipo],
      estado: [item.estado]
    });
    this.dialog.open(this.procesadasModalTemplate, { width: '600px' });
  }

  eliminarProcesada(item: ProcesadaTransparencia) {
    if (confirm(`¿Eliminar la procesada con RUT "${item.rutDeclarante}"?`)) {
      this.dataSource = this.dataSource.filter(d => d.id !== item.id);
    }
  }

  guardar() {
    const val = this.formProcesada.value;
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
