import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone:false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // Datos dummy de usuario
  currentUser = {
    name: 'Martín Ríos',
    photoUrl: 'https://via.placeholder.com/50'
  };

  // Control del sidenav
  isMobile = false;
  isSidenavOpen = true; // En desktop, por defecto abierto

  // Ejemplo de menú
  menuItems = [
    { title: 'Inicio', route: '/inicio', icon: 'assets/icons/icon-menu-home.svg' },
    { title: 'Mis Declaraciones', route: '/declaraciones', icon: 'assets/icons/icon-menu-mis_declaraciones.svg' },
    { title: 'Revisor', route: '/revisor', icon: 'assets/icons/icon-menu-revisor.svg' },
    { title: 'Ministro de Fe', route: '/ministro-fe', icon: 'assets/icons/icon-menu-ministro_fe.svg' },
    { title: 'Administración', route: '/administracion', icon: 'assets/icons/icon-menu-administracion.svg' },
    { title: 'Organismo Fiscalizador', route: '/organismo-fiscalizador', icon: 'assets/icons/icon-menu-organismo_fiscalizador.svg' },
    { title: 'Transparencia Pasiva', route: '/transparencia-pasiva', icon: 'assets/icons/icon-menu-transparencia_pasiva.svg' },

    // ...
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    // Si es mobile, cierra el sidenav por defecto
    if (this.isMobile) {
      this.isSidenavOpen = false;
    } else {
      // En desktop, abierto por defecto
      this.isSidenavOpen = true;
    }
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  getIcon(item: any): string {
    const currentUrl = this.router.url;
    // Si la ruta actual coincide exactamente o empieza con la ruta del item, se considera activa.
    if (currentUrl === item.route || currentUrl.startsWith(item.route + '/')) {
      // Por ejemplo, si el icono es "assets/icons/icon-menu-home.svg"
      // retorna "assets/icons/icon-menu-home_active.svg"
      return item.icon.replace('.svg', '_active.svg');
    } else {
      return item.icon;
    }
  }

  logout() {
    console.log('Cerrar sesión...');
    // Lógica real de logout
  }
}
