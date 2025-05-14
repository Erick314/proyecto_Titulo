import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./navbar.component.scss'],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  menuOpen = true;
  constructor(private router: Router) {} // Inyecta el Router

  @Output() menuState = new EventEmitter<boolean>();
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.menuState.emit(this.menuOpen); // emite el estado
  }

  cerrarSesion() {
    // Aquí puedes agregar la lógica para cerrar la sesión
    // Por ejemplo, limpiar tokens, eliminar datos del localStorage, etc.
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
  }
}
