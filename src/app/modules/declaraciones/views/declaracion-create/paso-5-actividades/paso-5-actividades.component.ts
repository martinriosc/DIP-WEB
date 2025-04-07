import { Component, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ValidadorDeclaracionService } from '../../../services/validador-declaracion.service';

interface ActividadItem {
  tipoActividad: string;
  rubroArea: string;
  vinculo: string;
}

@Component({
  selector: 'app-paso-5-actividades',
  templateUrl: './paso-5-actividades.component.html',
  styleUrls: ['./paso-5-actividades.component.scss']
})
export class Paso5ActividadesComponent {
  tieneActividades = 'no';

  actividadesData: ActividadItem[] = [
    { tipoActividad: 'ECONOMICA', rubroArea: 'ADMINISTRADOR DE EMPRESAS', vinculo: 'Data Sensible' }
  ];
  displayedColumns: string[] = ['tipoActividad', 'rubroArea', 'vinculo', 'acciones'];

  @ViewChild('actividadModal') actividadModal!: TemplateRef<any>;
  actividadForm!: FormGroup;
  editMode = false;
  currentItem: ActividadItem | null = null;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private validadorDeclaracionService: ValidadorDeclaracionService
  ) {}

  openAddModal() {
    this.editMode = false;
    this.currentItem = null;
    this.buildForm();
    this.dialog.open(this.actividadModal);
  }

  openEditModal(act: ActividadItem) {
    this.editMode = true;
    this.currentItem = act;
    this.buildForm(act);
    this.dialog.open(this.actividadModal);
  }

  buildForm(item?: ActividadItem) {
    this.actividadForm = this.fb.group({
      tipoActividad: [item?.tipoActividad || 'ECONOMICA'],
      rubroArea: [item?.rubroArea || ''],
      vinculo: [item?.vinculo || '']
    });
  }

  saveActividad(dialogRef: any) {
    if (this.actividadForm.valid) {
      const formValue = this.actividadForm.value as ActividadItem;
      if (this.editMode && this.currentItem) {
        const i = this.actividadesData.indexOf(this.currentItem);
        if (i >= 0) {
          this.actividadesData[i] = formValue;
        }
      } else {
        this.actividadesData.push(formValue);
      }
      dialogRef.close();

      // Marca el paso como completo (puedes ajustar la lógica a tus necesidades)
      this.validadorDeclaracionService.setPasoCompleto('paso5', true);
    }
  }

  eliminarActividad(act: ActividadItem) {
    this.actividadesData = this.actividadesData.filter(a => a !== act);
  }

  // Ejemplo de validación: si "No tiene" actividades, podrías marcar incompleto. Ajusta según tu lógica
  onTieneActividadesChange(value: string) {
    this.tieneActividades = value;
    if (value === 'no') {
      // Podrías limpiar la lista, etc.
      this.validadorDeclaracionService.setPasoCompleto('paso5', false);
    }
  }
}
