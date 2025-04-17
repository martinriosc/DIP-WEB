import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  activo: boolean;
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nombreCompleto', 'email', 'activo', 'acciones'];
  dataSource: Usuario[] = [];

  // Referencia al <ng-template> para el modal
  @ViewChild('usuarioModal') usuarioModalTemplate!: TemplateRef<any>;

  // Controla si estamos en "crear" o "editar"
  editMode = false;

  // Formulario reactivo
  usuarioForm!: FormGroup;

  // Almacena temporalmente el ID (para editar)
  private currentEditId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Carga inicial (o llama un servicio HTTP)
    this.dataSource = [
      { id: 1, nombre: 'Juan', apellido: 'Pérez', email: 'juan@ejemplo.com', activo: true },
      { id: 2, nombre: 'María', apellido: 'Gómez', email: 'maria@ejemplo.com', activo: false }
    ];
  }

  // Abre el modal en "crear" mode
  crearUsuario(): void {
    this.editMode = false;
    this.currentEditId = null;
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      activo: [true]
    });

    this.dialog.open(this.usuarioModalTemplate, {
      width: '600px'
    });
  }

  // Abre el modal en "editar" mode
  editarUsuario(usuario: Usuario): void {
    this.editMode = true;
    this.currentEditId = usuario.id;
    this.usuarioForm = this.fb.group({
      nombre: [usuario.nombre, Validators.required],
      apellido: [usuario.apellido, Validators.required],
      email: [usuario.email, [Validators.required, Validators.email]],
      activo: [usuario.activo]
    });

    this.dialog.open(this.usuarioModalTemplate, {
      width: '600px'
    });
  }

  eliminarUsuario(usuario: Usuario) {
    if (confirm(`¿Seguro de eliminar al usuario ${usuario.nombre}?`)) {
      this.dataSource = this.dataSource.filter(u => u.id !== usuario.id);
    }
  }

  // Guardar en el modal
  guardar() {
    if (this.usuarioForm.valid) {
      const formValue = this.usuarioForm.value;

      if (!this.editMode) {
        // Modo crear
        const nuevoId = this.dataSource.length > 0 
          ? Math.max(...this.dataSource.map(u => u.id)) + 1
          : 1;

        const nuevoUsuario: Usuario = {
          id: nuevoId,
          nombre: formValue.nombre,
          apellido: formValue.apellido,
          email: formValue.email,
          activo: formValue.activo
        };
        this.dataSource.push(nuevoUsuario);
      } else {
        // Modo editar
        const index = this.dataSource.findIndex(u => u.id === this.currentEditId);
        if (index >= 0) {
          this.dataSource[index] = {
            id: this.currentEditId!,
            ...formValue
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
