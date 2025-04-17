import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

export interface Profesion {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

@Component({
  selector: 'app-parametro-profesion',
  templateUrl: './parametro-profesion.component.html',
  styleUrls: ['./parametro-profesion.component.scss']
})
export class ParametroProfesionComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nombre', 'activo', 'acciones'];
  dataSource: Profesion[] = [];

  @ViewChild('profesionModal') profesionModalTemplate!: TemplateRef<any>;

  formProfesion!: FormGroup;
  editMode = false;
  private currentEditId: number | null = null;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource = [
      { id: 1, nombre: 'Ingeniería', descripcion: 'Profesión en ingeniería', activo: true },
      { id: 2, nombre: 'Medicina', descripcion: 'Profesión médica', activo: true }
    ];
  }

  crearProfesion() {
    this.editMode = false;
    this.currentEditId = null;
    this.formProfesion = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      activo: [true]
    });
    this.dialog.open(this.profesionModalTemplate, { width: '600px' });
  }

  editarProfesion(item: Profesion) {
    this.editMode = true;
    this.currentEditId = item.id;
    this.formProfesion = this.fb.group({
      nombre: [item.nombre, Validators.required],
      descripcion: [item.descripcion],
      activo: [item.activo]
    });
    this.dialog.open(this.profesionModalTemplate, { width: '600px' });
  }

  eliminarProfesion(item: Profesion) {
    if (confirm(`¿Eliminar la profesión "${item.nombre}"?`)) {
      this.dataSource = this.dataSource.filter(p => p.id !== item.id);
    }
  }

  guardar() {
    if (this.formProfesion.valid) {
      const formVal = this.formProfesion.value;
      if (!this.editMode) {
        const newId = this.dataSource.length > 0 ? Math.max(...this.dataSource.map(p => p.id)) + 1 : 1;
        this.dataSource.push({ id: newId, ...formVal });
      } else {
        const index = this.dataSource.findIndex(p => p.id === this.currentEditId);
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
