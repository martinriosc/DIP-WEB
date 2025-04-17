import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

export interface Configuracion {
  id: number;
  clave: string;
  valor: string;
  descripcion: string;
  activo: boolean;
}

@Component({
  selector: 'app-parametro-configuracion',
  templateUrl: './parametro-configuracion.component.html',
  styleUrls: ['./parametro-configuracion.component.scss']
})
export class ParametroConfiguracionComponent implements OnInit {

  displayedColumns: string[] = ['id', 'clave', 'valor', 'activo', 'acciones'];
  dataSource: Configuracion[] = [];

  @ViewChild('configModal') configModalTemplate!: TemplateRef<any>;

  formConfig!: FormGroup;
  editMode = false;
  private currentEditId: number | null = null;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    // Datos de ejemplo
    this.dataSource = [
      { id: 1, clave: 'SITE_NAME', valor: 'Mi Plataforma', descripcion: 'Nombre del sitio', activo: true },
      { id: 2, clave: 'MAX_LOGIN_ATTEMPTS', valor: '5', descripcion: 'Máximo de intentos de login', activo: true }
    ];
  }

  crearConfig() {
    this.editMode = false;
    this.currentEditId = null;
    this.formConfig = this.fb.group({
      clave: ['', Validators.required],
      valor: ['', Validators.required],
      descripcion: [''],
      activo: [true]
    });
    this.dialog.open(this.configModalTemplate, { width: '600px' });
  }

  editarConfig(item: Configuracion) {
    this.editMode = true;
    this.currentEditId = item.id;
    this.formConfig = this.fb.group({
      clave: [item.clave, Validators.required],
      valor: [item.valor, Validators.required],
      descripcion: [item.descripcion],
      activo: [item.activo]
    });
    this.dialog.open(this.configModalTemplate, { width: '600px' });
  }

  eliminarConfig(item: Configuracion) {
    if (confirm(`¿Eliminar la configuración "${item.clave}"?`)) {
      this.dataSource = this.dataSource.filter(x => x.id !== item.id);
    }
  }

  guardar() {
    if (this.formConfig.valid) {
      const formVal = this.formConfig.value;
      if (!this.editMode) {
        const newId = this.dataSource.length > 0 ? Math.max(...this.dataSource.map(x => x.id)) + 1 : 1;
        this.dataSource.push({ id: newId, ...formVal });
      } else {
        const index = this.dataSource.findIndex(x => x.id === this.currentEditId);
        if (index >= 0) {
          this.dataSource[index] = { id: this.currentEditId!, ...formVal };
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
