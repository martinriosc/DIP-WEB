import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Texto {
  id: number;
  titulo: string;
  contenido: string;
  seccion: string;
}

@Component({
  selector: 'app-textos',
  templateUrl: './textos.component.html',
  styleUrls: ['./textos.component.scss']
})
export class TextosComponent implements OnInit {

  displayedColumns: string[] = ['id', 'titulo', 'seccion', 'acciones'];
  dataSource: Texto[] = [];

  @ViewChild('textoModal') textoModalTemplate!: TemplateRef<any>;

  textoForm!: FormGroup;
  editMode = false;
  private currentEditId: number | null = null;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Cargar data inicial
    this.dataSource = [
      { id: 1, titulo: 'Aviso Legal', contenido: 'Contenido legal...', seccion: 'Footer' },
      { id: 2, titulo: 'Mensaje Bienvenida', contenido: 'Bienvenidos...', seccion: 'Home' }
    ];
  }

  crearTexto() {
    this.editMode = false;
    this.currentEditId = null;
    this.textoForm = this.fb.group({
      titulo: ['', Validators.required],
      contenido: ['', Validators.required],
      seccion: ['']
    });
    this.dialog.open(this.textoModalTemplate, {
      width: '600px'
    });
  }

  editarTexto(texto: Texto) {
    this.editMode = true;
    this.currentEditId = texto.id;
    this.textoForm = this.fb.group({
      titulo: [texto.titulo, Validators.required],
      contenido: [texto.contenido, Validators.required],
      seccion: [texto.seccion]
    });
    this.dialog.open(this.textoModalTemplate, {
      width: '600px'
    });
  }

  eliminarTexto(texto: Texto) {
    if (confirm(`¿Eliminar el texto "${texto.titulo}"?`)) {
      this.dataSource = this.dataSource.filter(t => t.id !== texto.id);
    }
  }

  guardar() {
    if (this.textoForm.valid) {
      const formValue = this.textoForm.value;
      if (!this.editMode) {
        // Crear
        const nuevoId = this.dataSource.length > 0
          ? Math.max(...this.dataSource.map(t => t.id)) + 1
          : 1;
        const nuevo: Texto = {
          id: nuevoId,
          titulo: formValue.titulo,
          contenido: formValue.contenido,
          seccion: formValue.seccion
        };
        this.dataSource.push(nuevo);
      } else {
        // Editar
        const i = this.dataSource.findIndex(t => t.id === this.currentEditId);
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
  }

  cerrarModal() {
    this.dialog.closeAll();
  }
}
