import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

interface PublicadaTransparencia {
  id: number;
  rutDeclarante: string;
  fechaPublicada: string;
  tipo: string;
  estado: string;
}

@Component({
  selector: 'app-transparencia-activa-publicadas',
  templateUrl: './transparencia-activa-publicadas.component.html',
  styleUrls: ['./transparencia-activa-publicadas.component.scss']
})
export class TransparenciaActivaPublicadasComponent implements OnInit {

  displayedColumns: string[] = ['id', 'rutDeclarante', 'fechaPublicada', 'tipo', 'estado', 'acciones'];
  dataSource: PublicadaTransparencia[] = [];

  @ViewChild('publicadasModal') publicadasModalTemplate!: TemplateRef<any>;

  formPublicada!: FormGroup;
  editMode = false;
  private currentEditId: number | null = null;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.dataSource = [
      { id: 10, rutDeclarante: '44.444.444-4', fechaPublicada: '2025-04-20', tipo: 'Periódica', estado: 'Publicada' }
    ];
  }

  crearPublicada() {
    this.editMode = false;
    this.currentEditId = null;
    this.formPublicada = this.fb.group({
      rutDeclarante: [''],
      fechaPublicada: [''],
      tipo: [''],
      estado: ['']
    });
    this.dialog.open(this.publicadasModalTemplate, { width: '600px' });
  }

  editarPublicada(item: PublicadaTransparencia) {
    this.editMode = true;
    this.currentEditId = item.id;
    this.formPublicada = this.fb.group({
      rutDeclarante: [item.rutDeclarante],
      fechaPublicada: [item.fechaPublicada],
      tipo: [item.tipo],
      estado: [item.estado]
    });
    this.dialog.open(this.publicadasModalTemplate, { width: '600px' });
  }

  eliminarPublicada(item: PublicadaTransparencia) {
    if (confirm(`¿Eliminar la publicación con RUT "${item.rutDeclarante}"?`)) {
      this.dataSource = this.dataSource.filter(d => d.id !== item.id);
    }
  }

  guardar() {
    const val = this.formPublicada.value;
    if (!this.editMode) {
      const newId = this.dataSource.length > 0
        ? Math.max(...this.dataSource.map(d => d.id)) + 1
        : 1;
      this.dataSource.push({
        id: newId,
        ...val
      });
    } else {
      const i = this.dataSource.findIndex(d => d.id === this.currentEditId);
      if (i >= 0) {
        this.dataSource[i] = {
          id: this.currentEditId!,
          ...val
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
