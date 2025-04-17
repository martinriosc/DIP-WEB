import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

export interface Actividad {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

@Component({
  selector: 'app-parametro-actividad',
  templateUrl: './parametro-actividad.component.html',
  styleUrls: ['./parametro-actividad.component.scss']
})
export class ParametroActividadComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nombre', 'activo', 'acciones'];
  dataSource: Actividad[] = [];

  @ViewChild('actividadModal') actividadModalTemplate!: TemplateRef<any>;

  formActividad!: FormGroup;
  editMode = false;
  private currentEditId: number | null = null;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource = [
      { id: 1, nombre: 'Administración', descripcion: 'Actividad de administración', activo: true },
      { id: 2, nombre: 'Operación', descripcion: 'Actividad operativa', activo: true }
    ];
  }

  crearActividad() {
    this.editMode = false;
    this.currentEditId = null;
    this.formActividad = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      activo: [true]
    });
    this.dialog.open(this.actividadModalTemplate, { width: '600px' });
  }

  editarActividad(item: Actividad) {
    this.editMode = true;
    this.currentEditId = item.id;
    this.formActividad = this.fb.group({
      nombre: [item.nombre, Validators.required],
      descripcion: [item.descripcion],
      activo: [item.activo]
    });
    this.dialog.open(this.actividadModalTemplate, { width: '600px' });
  }

  eliminarActividad(item: Actividad) {
    if (confirm(`¿Eliminar la actividad "${item.nombre}"?`)) {
      this.dataSource = this.dataSource.filter(a => a.id !== item.id);
    }
  }

  guardar() {
    if (this.formActividad.valid) {
      const formVal = this.formActividad.value;
      if (!this.editMode) {
        const newId = this.dataSource.length > 0 ? Math.max(...this.dataSource.map(a => a.id)) + 1 : 1;
        this.dataSource.push({ id: newId, ...formVal });
      } else {
        const index = this.dataSource.findIndex(a => a.id === this.currentEditId);
        if (index >= 0) {
          this.dataSource[index] = { id: this.currentEditId!, ...formVal };
        }
      }
      this.dataSource = [...this.dataSource];
      this.dialog.closeAll();
    }
  }

  cerrarModal() {
    this.dialog.closeAll();
  }
}
