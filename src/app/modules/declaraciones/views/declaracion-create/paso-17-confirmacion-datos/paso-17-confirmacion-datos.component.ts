import { Component, OnInit } from '@angular/core';
import { ValidadorDeclaracionService } from '../../../services/validador-declaracion.service';

@Component({
  selector: 'app-paso-17-confirmacion-datos',
  templateUrl: './paso-17-confirmacion-datos.component.html',
  styleUrls: ['./paso-17-confirmacion-datos.component.scss']
})
export class Paso17ConfirmacionDatosComponent implements OnInit {
  aceptaResponsabilidad = false;
  advertencias: string[] = [];

  constructor(private validadorDeclaracionService: ValidadorDeclaracionService) {}

  ngOnInit(): void {
    // Revisamos si todo está completo
    const todoOk = this.validadorDeclaracionService.estanTodosCompletos();
    if (!todoOk) {
      this.advertencias = this.validadorDeclaracionService.getAdvertencias();
    } else {
      this.advertencias = [];
    }
  }

  finalizar(): void {
    if (this.advertencias.length > 0) {
      alert('Aún hay pasos incompletos. Revisa la lista antes de finalizar.');
      return;
    }
    if (!this.aceptaResponsabilidad) {
      alert('Debes declarar que la información es verídica antes de finalizar.');
      return;
    }

    // Lógica de guardado / envío final
    this.validadorDeclaracionService.enviarDeclaracionFinal();
    alert('¡Declaración finalizada con éxito!');
    // Navegar o mostrar otra vista
  }
}
