import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.scss']
})
export class AdministracionComponent implements OnInit {

  // Sección principal actual: 'usuarios', 'parametros', 'textos', 'declaraciones', 'transparencia-activa', 'reportes'
  currentSection: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a los eventos de navegación para actualizar currentSection según la URL
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // event.urlAfterRedirects o event.url => la URL actual
        const url: string = event.urlAfterRedirects || event.url;

        // Extraemos lo que viene después de /administracion/...
        // Ej. '/administracion/parametros/utm' => splitted[0] = 'parametros'
        const splitted = url.split('/').filter(Boolean); 
        // splitted podría ser ["administracion", "parametros", "utm"] => splitted[1] = 'parametros'

        if (splitted.length > 1) {
          this.currentSection = splitted[1]; // la 2da parte del path
        } else {
          this.currentSection = 'usuarios'; // default
        }
      });
  }

  // Navegación principal
  mainNav = [
    { label: 'Usuarios', route: '/administracion/usuarios', section: 'usuarios' },
    { label: 'Parámetros', route: '/administracion/parametros/servicio', section: 'parametros' },
    { label: 'Textos', route: '/administracion/textos', section: 'textos' },
    { label: 'Declaraciones', route: '/administracion/declaraciones', section: 'declaraciones' },
    { label: 'Transparencia Activa', route: '/administracion/transparencia-activa/pendientes', section: 'transparencia-activa' },
    { label: 'Reportes', route: '/administracion/reportes', section: 'reportes' }
  ];

  // Submenú para 'parametros'
  parametrosNav = [
    { label: 'Servicio', route: '/administracion/parametros/servicio' },
    { label: 'UTM', route: '/administracion/parametros/utm' },
    { label: 'Marca Vehículo', route: '/administracion/parametros/marca-vehiculo' },
    { label: 'Tipo Vehículo', route: '/administracion/parametros/tipo-vehiculo' },
    { label: 'Profesión', route: '/administracion/parametros/profesion' },
    { label: 'Actividad', route: '/administracion/parametros/actividad' },
    { label: 'PDF Reservado', route: '/administracion/parametros/pdf-reservado' },
    { label: 'JSON Reservado', route: '/administracion/parametros/json-reservado' },
    { label: 'Configuración', route: '/administracion/parametros/configuracion' }
  ];

  // Submenú para 'transparencia-activa'
  transparenciaNav = [
    { label: 'Pendientes', route: '/administracion/transparencia-activa/pendientes' },
    { label: 'Procesadas', route: '/administracion/transparencia-activa/procesadas' },
    { label: 'Publicadas', route: '/administracion/transparencia-activa/publicadas' },
    { label: 'Con Errores', route: '/administracion/transparencia-activa/con-errores' }
  ];

  isActiveSection(section: string): boolean {
    return this.currentSection === section;
  }
}
