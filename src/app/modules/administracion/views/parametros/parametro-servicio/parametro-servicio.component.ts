import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

// Ejemplo de interfaz (ajusta campos según tus imágenes)
interface ServicioParam {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string;
  activo: boolean;
}

@Component({
  selector: 'app-parametro-servicio',
  templateUrl: './parametro-servicio.component.html',
  styleUrls: ['./parametro-servicio.component.scss']
})
export class ParametroServicioComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nombre', 'codigo', 'activo', 'acciones'];
  dataSource: ServicioParam[] = [];

  // Modal template
  @ViewChild('servicioModal') servicioModalTemplate!: TemplateRef<any>;

  // Form
  formServicio!: FormGroup;
  editMode = false;
  private currentEditId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Carga inicial de datos, o HTTP call
    this.dataSource = [
      { id: 1, nombre: 'Servicio A', codigo: 'SVC-A', descripcion: 'Desc de A', activo: true },
      { id: 2, nombre: 'Servicio B', codigo: 'SVC-B', descripcion: 'Desc de B', activo: false }
    ];
  }

  crearServicio() {
    this.editMode = false;
    this.currentEditId = null;
    this.formServicio = this.fb.group({
      nombre: ['', Validators.required],
      codigo: ['', Validators.required],
      descripcion: [''],
      activo: [true]
    });
    this.dialog.open(this.servicioModalTemplate, { width: '600px' });
  }

  editarServicio(serv: ServicioParam) {
    this.editMode = true;
    this.currentEditId = serv.id;
    this.formServicio = this.fb.group({
      nombre: [serv.nombre, Validators.required],
      codigo: [serv.codigo, Validators.required],
      descripcion: [serv.descripcion],
      activo: [serv.activo]
    });
    this.dialog.open(this.servicioModalTemplate, { width: '600px' });
  }

  eliminarServicio(serv: ServicioParam) {
    if (confirm(`¿Eliminar el servicio "${serv.nombre}"?`)) {
      this.dataSource = this.dataSource.filter(s => s.id !== serv.id);
    }
  }

  guardar() {
    if (this.formServicio.valid) {
      const formVal = this.formServicio.value;
      if (!this.editMode) {
        // Crear
        const newId = this.dataSource.length > 0 
          ? Math.max(...this.dataSource.map(s => s.id)) + 1
          : 1;
        const nuevo: ServicioParam = {
          id: newId,
          nombre: formVal.nombre,
          codigo: formVal.codigo,
          descripcion: formVal.descripcion,
          activo: formVal.activo
        };
        this.dataSource.push(nuevo);
      } else {
        // Editar
        const i = this.dataSource.findIndex(s => s.id === this.currentEditId);
        if (i >= 0) {
          this.dataSource[i] = {
            id: this.currentEditId!,
            ...formVal
          };
        }
      }
      // Refresca la tabla
      this.dataSource = [...this.dataSource];
      // Cierra el dialog
      this.dialog.closeAll();
    }
  }

  cerrarModal() {
    this.dialog.closeAll();
  }
}
