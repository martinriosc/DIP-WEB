import { Component, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-transparencia-activa',
  templateUrl: './transparencia-activa.component.html',
  styleUrls: ['./transparencia-activa.component.scss']
})
export class TransparenciaActivaComponent {
  @ViewChild('transparenciaModal') transparenciaModal!: TemplateRef<any>;

  dataSource: any[] = [
    { id: 1, titulo: 'Organigrama Institucional', categoria: 'Estructura', fechaPublicacion: '2024-01-15', estado: 'Publicado' },
    { id: 2, titulo: 'Presupuesto Anual 2024', categoria: 'Presupuesto', fechaPublicacion: '2024-02-01', estado: 'Publicado' },
    { id: 3, titulo: 'Plan de Compras', categoria: 'Contratación', fechaPublicacion: '2024-01-10', estado: 'Pendiente' }
  ];

  displayedColumns: string[] = ['id', 'titulo', 'categoria', 'fechaPublicacion', 'estado', 'acciones'];
  transparenciaForm!: FormGroup;
  editMode = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.initForm();
  }

  initForm() {
    this.transparenciaForm = this.fb.group({
      titulo: ['', Validators.required],
      categoria: ['', Validators.required],
      fechaPublicacion: ['', Validators.required],
      estado: ['', Validators.required],
      url: ['']
    });
  }

  crearTransparencia() {
    this.editMode = false;
    this.transparenciaForm.reset();
    this.dialog.open(this.transparenciaModal);
  }

  editarTransparencia(element: any) {
    this.editMode = true;
    this.transparenciaForm.patchValue(element);
    this.dialog.open(this.transparenciaModal);
  }

  eliminarTransparencia(element: any) {
    console.log('Eliminar transparencia:', element);
  }

  guardar() {
    if (this.transparenciaForm.valid) {
      console.log('Guardar transparencia:', this.transparenciaForm.value);
      this.cerrarModal();
    }
  }

  cerrarModal() {
    this.dialog.closeAll();
  }
}
