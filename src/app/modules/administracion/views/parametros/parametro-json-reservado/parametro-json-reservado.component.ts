import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

export interface JsonReservado {
  id: number;
  nombre: string;
  ruta: string;
  activo: boolean;
}

@Component({
  selector: 'app-parametro-json-reservado',
  templateUrl: './parametro-json-reservado.component.html',
  styleUrls: ['./parametro-json-reservado.component.scss']
})
export class ParametroJsonReservadoComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nombre', 'ruta', 'activo', 'acciones'];
  dataSource: JsonReservado[] = [];

  @ViewChild('jsonModal') jsonModalTemplate!: TemplateRef<any>;

  formJson!: FormGroup;
  editMode = false;
  private currentEditId: number | null = null;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    // Datos de ejemplo
    this.dataSource = [
      { id: 1, nombre: 'JSON Reservado A', ruta: '/assets/jsonA.json', activo: true },
      { id: 2, nombre: 'JSON Reservado B', ruta: '/assets/jsonB.json', activo: false }
    ];
  }

  crearJson() {
    this.editMode = false;
    this.currentEditId = null;
    this.formJson = this.fb.group({
      nombre: ['', Validators.required],
      ruta: ['', Validators.required],
      activo: [true]
    });
    this.dialog.open(this.jsonModalTemplate, { width: '600px' });
  }

  editarJson(item: JsonReservado) {
    this.editMode = true;
    this.currentEditId = item.id;
    this.formJson = this.fb.group({
      nombre: [item.nombre, Validators.required],
      ruta: [item.ruta, Validators.required],
      activo: [item.activo]
    });
    this.dialog.open(this.jsonModalTemplate, { width: '600px' });
  }

  eliminarJson(item: JsonReservado) {
    if (confirm(`¿Eliminar el JSON reservado "${item.nombre}"?`)) {
      this.dataSource = this.dataSource.filter(x => x.id !== item.id);
    }
  }

  guardar() {
    if (this.formJson.valid) {
      const formVal = this.formJson.value;
      if (!this.editMode) {
        const newId = this.dataSource.length > 0 ? Math.max(...this.dataSource.map(x => x.id)) + 1 : 1;
        this.dataSource.push({ id: newId, ...formVal });
      } else {
        const index = this.dataSource.findIndex(x => x.id === this.currentEditId);
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
