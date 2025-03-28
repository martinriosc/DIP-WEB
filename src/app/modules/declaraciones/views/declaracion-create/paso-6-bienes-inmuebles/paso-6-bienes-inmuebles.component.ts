import { Component } from '@angular/core';
interface BienChile {
  region: string;
  comuna: string;
  direccion: string;
  inscripcion: string;
  fojas: string;
  anio: number;
  rolAvaluo: string;
}

interface BienExtranjero {
  pais: string;
  direccion: string;
  // etc.
}
@Component({
  selector: 'app-paso-6-bienes-inmuebles',
  templateUrl: './paso-6-bienes-inmuebles.component.html',
  styleUrls: ['./paso-6-bienes-inmuebles.component.scss']
})
export class Paso6BienesInmueblesComponent {
  tieneChile = 'si';       // radio si/no
  tieneExtranjero = 'no';  // radio si/no

  bienesChile: BienChile[] = [
    { region: 'METROPOLITANA', comuna: 'SANTIAGO', direccion: 'EJERCITO 60', inscripcion: '9193', fojas: '5754', anio: 2008, rolAvaluo: '718-140' },
    { region: 'METROPOLITANA', comuna: 'PROVIDENCIA', direccion: 'LOS CAPITANES', inscripcion: '13829', fojas: '11875', anio: 2009, rolAvaluo: '4018-149' }
  ];

  displayedColumnsChile = ['region', 'comuna', 'direccion', 'inscripcion', 'fojas', 'anio', 'rolAvaluo', 'acciones'];

  bienesExtranjero: BienExtranjero[] = [];
  displayedColumnsExtranjero = ['pais', 'direccion', 'accionesExt'];

  agregarBienChile() {
    console.log('Agregar Bien Inmueble en Chile...');
  }

  editarBien(b: BienChile) {
    console.log('Editar Bien en Chile:', b);
  }

  eliminarBien(b: BienChile) {
    this.bienesChile = this.bienesChile.filter(x => x !== b);
  }

  agregarBienExtranjero() {
    console.log('Agregar Bien Inmueble en el Extranjero...');
  }

  editarBienExt(b: BienExtranjero) {
    console.log('Editar Bien en Extranjero:', b);
  }

  eliminarBienExt(b: BienExtranjero) {
    this.bienesExtranjero = this.bienesExtranjero.filter(x => x !== b);
  }
}
