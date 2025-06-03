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
    { label: 'Usuarios', route: '/administracion/usuarios', section: 'usuarios', icon: 'people' },
    { label: 'Parámetros', route: '/administracion/parametros/servicio', section: 'parametros', icon: 'settings' },
    { label: 'Textos', route: '/administracion/textos', section: 'textos', icon: 'text_fields' },
    { label: 'Declaraciones', route: '/administracion/declaraciones', section: 'declaraciones', icon: 'description' },
    { label: 'Transparencia Activa', route: '/administracion/transparencia-activa/pendientes', section: 'transparencia-activa', icon: 'visibility' },
    { label: 'Reportes', route: '/administracion/reportes', section: 'reportes', icon: 'assessment' }
  ];

  // Submenú para 'parametros'
  parametrosNav = [
    { label: 'Servicio', route: '/administracion/parametros/servicio', icon: 'business' },
    { label: 'UTM', route: '/administracion/parametros/utm', icon: 'location_on' },
    { label: 'Marca Vehículo', route: '/administracion/parametros/marca-vehiculo', icon: 'directions_car' },
    { label: 'Tipo Vehículo', route: '/administracion/parametros/tipo-vehiculo', icon: 'local_shipping' },
    { label: 'Profesión', route: '/administracion/parametros/profesion', icon: 'work' },
    { label: 'Actividad', route: '/administracion/parametros/actividad', icon: 'assignment' },
    { label: 'PDF Reservado', route: '/administracion/parametros/pdf-reservado', icon: 'picture_as_pdf' },
    { label: 'JSON Reservado', route: '/administracion/parametros/json-reservado', icon: 'code' },
    { label: 'Configuración', route: '/administracion/parametros/configuracion', icon: 'tune' }
  ];

  // Submenú para 'transparencia-activa'
  transparenciaNav = [
    { label: 'Pendientes', route: '/administracion/transparencia-activa/pendientes', icon: 'schedule' },
    { label: 'Procesadas', route: '/administracion/transparencia-activa/procesadas', icon: 'check_circle' },
    { label: 'Publicadas', route: '/administracion/transparencia-activa/publicadas', icon: 'publish' },
    { label: 'Con Errores', route: '/administracion/transparencia-activa/con-errores', icon: 'error' }
  ];

  isActiveSection(section: string): boolean {
    return this.currentSection === section;
  }
}
