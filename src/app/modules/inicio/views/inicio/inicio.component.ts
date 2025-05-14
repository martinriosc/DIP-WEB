import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';
import { DeclaracionService } from 'src/app/modules/declaraciones/services/declaracion.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent {
  @ViewChild('nuevaDeclaracionModal') nuevaDeclaracionModal!: TemplateRef<any>;
  @ViewChild('rectificarDeclaracionModal') rectificarDeclaracionModal!: TemplateRef<any>;
  @ViewChild('ultimosDatosModal') ultimosDatosModal!: TemplateRef<any>;
  @ViewChild('listadoDeclaracionesModal') listadoDeclaracionesModal!: TemplateRef<any>;

  isLoading: boolean = false;

  nombreUsuario = 'CHRISTIAN ALEJANDRO CONTARDO SALINAS';
  declaraciones = {
    totales: 22,
    borradores: 3,
    enviadas: 9,
    recepcionadas: 9,
    archivadas: 1
  };

  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private _declaracion: DeclaracionService,
    private _declaracionHelper: DeclaracionHelperService,
    private _toastr: ToastrService,
    private _auth: AuthService,
  ) { }

  ngOnInit(): void {
    this._declaracionHelper.setDeclaranteId(this._auth.currentUser?.idDeclarante ?? 0);
  }

  openModalNuevaDeclaracion() {
    this.dialog.open(this.nuevaDeclaracionModal);
  }

  crearNuevaDeclaracion() {
    this._declaracion.validarNuevaDeclaracion().subscribe({
      next: (res: any) => {
        if (!res.data) {
          this.dialog.closeAll();
          this.router.navigate(['declaraciones', 'detalle']);
        } else {
          this._toastr.error('No se puede crear una nueva declaración. Ya existe una declaración con estado BORRADOR.')
        }

      },
      error: (err: any) => {
        console.log(err);
        this._toastr.error('No se puede crear una nueva declaración. Ya existe una declaración con estado BORRADOR.')
      }
    });

  }

  nuevaDeclaracionConDatosAnteriores() {
    this.dialog.open(this.ultimosDatosModal);
  }

  crearConUltimosDatos() {
    this._declaracion.crearNuevaDeclaracionConUltimosDatos().subscribe({
      next: (res: any) => {
        console.log(res)
        this._declaracionHelper.setDeclaracionId(res.data.declaracionId);
        this._declaracionHelper.setDeclaranteId(res.data.personaId);
        this.dialog.closeAll();
        this.router.navigate(['declaraciones', 'detalle']);
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  listarDatosAnteriores() {
    this.isLoading = true;
    this.dialog.open(this.listadoDeclaracionesModal);

    this._declaracion.listarDeclaracionesParaClonar().subscribe({
      next: (res: any) => {
        this.dataSource = res.data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.isLoading = false;

      }
    })
  }

  crearConDatosAnteriores(row: any) {
    console.log(row)


    // this._declaracion.validarNuevaDeclaracion().subscribe({
    //   next: (res: any) => {
    //     if (res) {
    //       this.dialog.closeAll();
    //       this.router.navigate(['declaraciones', 'detalle'], {
    //         queryParams: { usarDatosAnteriores: true }
    //       });
    //     } else {
    //       this._toastr.error('No se puede crear una nueva declaración. Ya existe una declaración con estado BORRADOR.')
    //     }

    //   },
    //   error: (err: any) => {
    //     console.log(err);
    //     this._toastr.error('No se puede crear una nueva declaración. Ya existe una declaración con estado BORRADOR.')
    //   }
    // });

  }


  clonarSeleccion() {

  }


  continuarPendiente() {
    this._declaracion.continuarBorrador().subscribe({
      next: (res: any) => {
        if (res.data) {
          this._declaracionHelper.setDeclaracionId(res.data.declaracionId);
          this._declaracionHelper.setDeclaranteId(res.data.personaId);
          this.dialog.closeAll();
          this.router.navigate(['declaraciones', 'detalle']);
        } else {
          this._toastr.error('No se continuar con la declaración. No existe una declaración con estado BORRADOR.')
        }

      },
      error: (err: any) => {
        console.log(err);
        this._toastr.error('No se continuar con la declaración. No existe una declaración con estado BORRADOR.')
      }
    })
  }

  openModalRectificarDeclaracion() {
    this.dialog.open(this.rectificarDeclaracionModal);
  }

  rectificarDeclaracion() {

  }

  getDatosDeclaraciones() {

  }

  getDatosUsuario() {

  }
}
