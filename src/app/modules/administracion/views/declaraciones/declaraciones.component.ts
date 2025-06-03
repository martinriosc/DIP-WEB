import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

interface DeclaracionAdmin {
  id: number;
  nroDeclaracion: string;
  fecha: string;
  tipo: string;
  estado: string;
}

@Component({
  selector: 'app-declaraciones',
  templateUrl: './declaraciones.component.html',
  styleUrls: ['./declaraciones.component.scss'],
  standalone: false
})
export class DeclaracionesComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nroDeclaracion', 'fecha', 'tipo', 'estado', 'acciones'];
  dataSource: DeclaracionAdmin[] = [];

  @ViewChild('declaracionModal') declaracionModalTemplate!: TemplateRef<any>;
  declaracionForm!: FormGroup;
  editMode = false;
  private currentEditId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dataSource = [
      { id: 1, nroDeclaracion: '12345', fecha: '2025-03-10', tipo: 'Primera', estado: 'Activa' },
      { id: 2, nroDeclaracion: '67890', fecha: '2025-04-05', tipo: 'Periódica', estado: 'Pendiente' }
    ];
  }

  crearDeclaracion() {
    this.editMode = false;
    this.currentEditId = null;
    this.declaracionForm = this.fb.group({
      nroDeclaracion: [''],
      fecha: [''],
      tipo: [''],
      estado: ['']
    });
    this.dialog.open(this.declaracionModalTemplate, { width: '600px' });
  }

  editarDeclaracion(decl: DeclaracionAdmin) {
    this.editMode = true;
    this.currentEditId = decl.id;
    this.declaracionForm = this.fb.group({
      nroDeclaracion: [decl.nroDeclaracion],
      fecha: [decl.fecha],
      tipo: [decl.tipo],
      estado: [decl.estado]
    });
    this.dialog.open(this.declaracionModalTemplate, { width: '600px' });
  }

  eliminarDeclaracion(decl: DeclaracionAdmin) {
    if (confirm(`¿Eliminar la declaración ${decl.nroDeclaracion}?`)) {
      this.dataSource = this.dataSource.filter(d => d.id !== decl.id);
    }
  }

  guardar() {
    const formValue = this.declaracionForm.value;
    if (!this.editMode) {
      // Crear
      const newId = this.dataSource.length > 0 
        ? Math.max(...this.dataSource.map(d => d.id)) + 1
        : 1;
      this.dataSource.push({
        id: newId,
        ...formValue
      });
    } else {
      // Editar
      const i = this.dataSource.findIndex(d => d.id === this.currentEditId);
      if (i >= 0) {
        this.dataSource[i] = {
          id: this.currentEditId!,
          ...formValue
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
