import { Component, HostListener, OnInit } from '@angular/core';

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
    { title: 'Inicio', route: '/inicio', icon: 'dashboard' },
    { title: 'Mis Declaraciones', route: '/declaraciones', icon: 'archive' },
    { title: 'Revisor', route: '/revisor', icon: 'check2-square' },
    { title: 'Ministro de Fe', route: '/ministro-fe', icon: 'person' },
    { title: 'Administración', route: '/administracion', icon: 'inboxes' },
    { title: 'Organismo Fiscalizador', route: '/organismo-fiscalizador', icon: 'bookmark-check' },
    { title: 'Transparencia Pasiva', route: '/transparencia-pasiva', icon: 'book' },

    // ...
  ];

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

  logout() {
    console.log('Cerrar sesión...');
    // Lógica real de logout
  }
}
