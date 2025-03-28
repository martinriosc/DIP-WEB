import { Component } from '@angular/core';
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

  agregarActividad() {
    console.log('Agregar nueva actividad...');
  }

  editarActividad(act: ActividadItem) {
    console.log('Editar:', act);
  }

  eliminarActividad(act: ActividadItem) {
    this.actividadesData = this.actividadesData.filter(a => a !== act);
  }
}
