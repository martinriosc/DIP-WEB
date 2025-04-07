import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent {
  @ViewChild('nuevaDeclaracionModal') nuevaDeclaracionModal!: TemplateRef<any>;

  nombreUsuario = 'CHRISTIAN ALEJANDRO CONTARDO SALINAS';
  declaraciones = {
    totales: 22,
    borradores: 3,
    enviadas: 9,
    recepcionadas: 9,
    archivadas: 1
  };

  constructor(private dialog: MatDialog, private router: Router) {}

  openModalNuevaDeclaracion() {
    this.dialog.open(this.nuevaDeclaracionModal);
  }

  crearNuevaDeclaracion(dialogRef: any) {
    dialogRef.close();
    this.router.navigate(['/declaracion/create']);
  }

  crearConDatosAnteriores(dialogRef: any) {
    dialogRef.close();
    this.router.navigate(['/declaracion/create'], {
      queryParams: { usarDatosAnteriores: true }
    });
  }
}
