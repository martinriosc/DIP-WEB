import { Component } from '@angular/core';

interface Tutela {
  run: string;
  tipoRelacion: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
}

@Component({
  selector: 'app-paso-4-tutela',
  templateUrl: './paso-4-tutela.component.html',
  styleUrls: ['./paso-4-tutela.component.scss']
})
export class Paso4TutelaComponent {
  tieneHijosTutela = false; // radio: si/no

  data: Tutela[] = [
    { run: '25757209-9', tipoRelacion: 'PATRIA POTESTAD', nombres: 'FRANCO', apellidoPaterno: 'CONTARDO', apellidoMaterno: 'VIVANCO' }
  ];

  agregarHijo() {
    // Lógica real (abrir modal, etc.)
    console.log('Agregar...');
  }
  editarHijo(element: Tutela) {
    console.log('Editar:', element);
  }
  eliminarHijo(element: Tutela) {
    console.log('Eliminar:', element);
    this.data = this.data.filter(d => d !== element);
  }
}
