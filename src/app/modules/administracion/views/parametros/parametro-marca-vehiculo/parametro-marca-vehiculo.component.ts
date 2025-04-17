import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

interface MarcaVehiculo {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

@Component({
  selector: 'app-parametro-marca-vehiculo',
  templateUrl: './parametro-marca-vehiculo.component.html',
  styleUrls: ['./parametro-marca-vehiculo.component.scss']
})
export class ParametroMarcaVehiculoComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nombre', 'activo', 'acciones'];
  dataSource: MarcaVehiculo[] = [];

  @ViewChild('marcaModal') marcaModalTemplate!: TemplateRef<any>;

  formMarca!: FormGroup;
  editMode = false;
  private currentEditId: number | null = null;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource = [
      { id: 1, nombre: 'Toyota', descripcion: 'Marca japonesa', activo: true },
      { id: 2, nombre: 'Ford', descripcion: 'Marca estadounidense', activo: true }
    ];
  }

  crearMarca() {
    this.editMode = false;
    this.currentEditId = null;
    this.formMarca = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      activo: [true]
    });
    this.dialog.open(this.marcaModalTemplate, { width: '600px' });
  }

  editarMarca(item: MarcaVehiculo) {
    this.editMode = true;
    this.currentEditId = item.id;
    this.formMarca = this.fb.group({
      nombre: [item.nombre, Validators.required],
      descripcion: [item.descripcion],
      activo: [item.activo]
    });
    this.dialog.open(this.marcaModalTemplate, { width: '600px' });
  }

  eliminarMarca(item: MarcaVehiculo) {
    if (confirm(`¿Eliminar la marca "${item.nombre}"?`)) {
      this.dataSource = this.dataSource.filter(x => x.id !== item.id);
    }
  }

  guardar() {
    if (this.formMarca.valid) {
      const formVal = this.formMarca.value;
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
