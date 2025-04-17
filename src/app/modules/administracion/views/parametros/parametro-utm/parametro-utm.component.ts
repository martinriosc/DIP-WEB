import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

interface UtmParam {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string;
  activo: boolean;
}

@Component({
  selector: 'app-parametro-utm',
  templateUrl: './parametro-utm.component.html',
  styleUrls: ['./parametro-utm.component.scss']
})
export class ParametroUtmComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nombre', 'codigo', 'activo', 'acciones'];
  dataSource: UtmParam[] = [];

  @ViewChild('utmModal') utmModalTemplate!: TemplateRef<any>;

  formUtm!: FormGroup;
  editMode = false;
  private currentEditId: number | null = null;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    // Datos de ejemplo
    this.dataSource = [
      { id: 1, nombre: 'UTM 1', codigo: 'UTM-001', descripcion: 'Descripción del UTM 1', activo: true },
      { id: 2, nombre: 'UTM 2', codigo: 'UTM-002', descripcion: 'Descripción del UTM 2', activo: false }
    ];
  }

  crearUtm() {
    this.editMode = false;
    this.currentEditId = null;
    this.formUtm = this.fb.group({
      nombre: ['', Validators.required],
      codigo: ['', Validators.required],
      descripcion: [''],
      activo: [true]
    });
    this.dialog.open(this.utmModalTemplate, { width: '600px' });
  }

  editarUtm(item: UtmParam) {
    this.editMode = true;
    this.currentEditId = item.id;
    this.formUtm = this.fb.group({
      nombre: [item.nombre, Validators.required],
      codigo: [item.codigo, Validators.required],
      descripcion: [item.descripcion],
      activo: [item.activo]
    });
    this.dialog.open(this.utmModalTemplate, { width: '600px' });
  }

  eliminarUtm(item: UtmParam) {
    if (confirm(`¿Eliminar el UTM "${item.nombre}"?`)) {
      this.dataSource = this.dataSource.filter(x => x.id !== item.id);
    }
  }

  guardar() {
    if (this.formUtm.valid) {
      const formVal = this.formUtm.value;
      if (!this.editMode) {
        const newId = this.dataSource.length > 0 ? Math.max(...this.dataSource.map(x => x.id)) + 1 : 1;
        this.dataSource.push({ id: newId, ...formVal });
      } else {
        const i = this.dataSource.findIndex(x => x.id === this.currentEditId);
        if (i >= 0) {
          this.dataSource[i] = { id: this.currentEditId!, ...formVal };
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
