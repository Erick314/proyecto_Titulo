// src/app/navbar/navbar.component.ts
import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core'; // Añadido OnInit y Output, EventEmitter
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../services/authentication/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./navbar.component.scss'],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  // Implementa OnInit
  menuOpen = true; // Asume que inicia abierto por defecto

  // Renombramos el EventEmitter para que coincida con lo que el DashboardComponent espera escuchar
  @Output() menuToggle = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private auth: Auth
  ) {}
  ngOnInit(): void {
    // Emite el estado inicial del menú cuando el componente se inicializa
    // Esto asegura que el DashboardComponent reciba el estado inicial del sidebar
    setTimeout(() => {
      // Pequeño delay para asegurar que el DashboardComponent esté listo para escuchar
      this.menuToggle.emit(this.menuOpen);
    }, 0);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    console.log('Estado del menú:', this.menuOpen);
    this.menuToggle.emit(this.menuOpen); // Emite el nuevo estado a través del EventEmitter
  }

  async cerrarSesion() {
    console.log('Cerrando sesión...');
    try {
      await this.authService.logout();
      console.log(this.auth.currentUser);
      if (this.auth.currentUser == null) {
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}
