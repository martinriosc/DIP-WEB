import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

interface ReporteAdmin {
  id: number;
  nombre: string;
  fechaGeneracion: string;
  tipo: string;
}

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nombre', 'fechaGeneracion', 'tipo', 'acciones'];
  dataSource: ReporteAdmin[] = [];

  @ViewChild('reporteModal') reporteModalTemplate!: TemplateRef<any>;
  reporteForm!: FormGroup;
  editMode = false;
  private currentEditId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dataSource = [
      { id: 1, nombre: 'Reporte Mensual', fechaGeneracion: '2025-02-15', tipo: 'PDF' },
      { id: 2, nombre: 'Reporte Consolidado', fechaGeneracion: '2025-03-01', tipo: 'XLSX' }
    ];
  }

  crearReporte() {
    this.editMode = false;
    this.currentEditId = null;
    this.reporteForm = this.fb.group({
      nombre: [''],
      fechaGeneracion: [''],
      tipo: ['']
    });
    this.dialog.open(this.reporteModalTemplate, { width: '600px' });
  }

  editarReporte(rep: ReporteAdmin) {
    this.editMode = true;
    this.currentEditId = rep.id;
    this.reporteForm = this.fb.group({
      nombre: [rep.nombre],
      fechaGeneracion: [rep.fechaGeneracion],
      tipo: [rep.tipo]
    });
    this.dialog.open(this.reporteModalTemplate, { width: '600px' });
  }

  eliminarReporte(rep: ReporteAdmin) {
    if (confirm(`¿Eliminar el reporte "${rep.nombre}"?`)) {
      this.dataSource = this.dataSource.filter(r => r.id !== rep.id);
    }
  }

  guardar() {
    const val = this.reporteForm.value;
    if (!this.editMode) {
      // Crear
      const nuevoId = this.dataSource.length > 0
        ? Math.max(...this.dataSource.map(r => r.id)) + 1
        : 1;
      this.dataSource.push({
        id: nuevoId,
        ...val
      });
    } else {
      // Editar
      const i = this.dataSource.findIndex(r => r.id === this.currentEditId);
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
