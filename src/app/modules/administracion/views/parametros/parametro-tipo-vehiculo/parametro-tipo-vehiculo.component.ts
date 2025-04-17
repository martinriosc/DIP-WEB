import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

interface TipoVehiculo {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

@Component({
  selector: 'app-parametro-tipo-vehiculo',
  templateUrl: './parametro-tipo-vehiculo.component.html',
  styleUrls: ['./parametro-tipo-vehiculo.component.scss']
})
export class ParametroTipoVehiculoComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nombre', 'activo', 'acciones'];
  dataSource: TipoVehiculo[] = [];

  @ViewChild('tipoModal') tipoModalTemplate!: TemplateRef<any>;

  formTipo!: FormGroup;
  editMode = false;
  private currentEditId: number | null = null;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource = [
      { id: 1, nombre: 'Sedán', descripcion: 'Automóvil de 4 puertas', activo: true },
      { id: 2, nombre: 'SUV', descripcion: 'Vehículo utilitario deportivo', activo: true }
    ];
  }

  crearTipo() {
    this.editMode = false;
    this.currentEditId = null;
    this.formTipo = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      activo: [true]
    });
    this.dialog.open(this.tipoModalTemplate, { width: '600px' });
  }

  editarTipo(item: TipoVehiculo) {
    this.editMode = true;
    this.currentEditId = item.id;
    this.formTipo = this.fb.group({
      nombre: [item.nombre, Validators.required],
      descripcion: [item.descripcion],
      activo: [item.activo]
    });
    this.dialog.open(this.tipoModalTemplate, { width: '600px' });
  }

  eliminarTipo(item: TipoVehiculo) {
    if (confirm(`¿Eliminar el tipo de vehículo "${item.nombre}"?`)) {
      this.dataSource = this.dataSource.filter(x => x.id !== item.id);
    }
  }

  guardar() {
    if (this.formTipo.valid) {
      const formVal = this.formTipo.value;
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
