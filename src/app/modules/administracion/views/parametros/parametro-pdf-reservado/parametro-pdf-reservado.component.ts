import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

export interface PdfReservado {
  id: number;
  nombre: string;
  ruta: string;
  activo: boolean;
}

@Component({
  selector: 'app-parametro-pdf-reservado',
  templateUrl: './parametro-pdf-reservado.component.html',
  styleUrls: ['./parametro-pdf-reservado.component.scss']
})
export class ParametroPdfReservadoComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nombre', 'ruta', 'activo', 'acciones'];
  dataSource: PdfReservado[] = [];

  @ViewChild('pdfModal') pdfModalTemplate!: TemplateRef<any>;

  formPdf!: FormGroup;
  editMode = false;
  private currentEditId: number | null = null;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource = [
      { id: 1, nombre: 'PDF Reservado A', ruta: '/assets/pdfA.pdf', activo: true },
      { id: 2, nombre: 'PDF Reservado B', ruta: '/assets/pdfB.pdf', activo: false }
    ];
  }

  crearPdf() {
    this.editMode = false;
    this.currentEditId = null;
    this.formPdf = this.fb.group({
      nombre: ['', Validators.required],
      ruta: ['', Validators.required],
      activo: [true]
    });
    this.dialog.open(this.pdfModalTemplate, { width: '600px' });
  }

  editarPdf(item: PdfReservado) {
    this.editMode = true;
    this.currentEditId = item.id;
    this.formPdf = this.fb.group({
      nombre: [item.nombre, Validators.required],
      ruta: [item.ruta, Validators.required],
      activo: [item.activo]
    });
    this.dialog.open(this.pdfModalTemplate, { width: '600px' });
  }

  eliminarPdf(item: PdfReservado) {
    if (confirm(`¿Eliminar el PDF reservado "${item.nombre}"?`)) {
      this.dataSource = this.dataSource.filter(x => x.id !== item.id);
    }
  }

  guardar() {
    if (this.formPdf.valid) {
      const formVal = this.formPdf.value;
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
