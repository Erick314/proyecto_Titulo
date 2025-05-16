import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, NgxSonnerToaster],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'inventario';
  menuOpen = true; // por defecto el menú está abierto

  constructor(public router: Router) {}

  hideNavbarRoutes = ['/', '/register', '/recovery'];

  get showNavbar(): boolean {
    return !this.hideNavbarRoutes.includes(this.router.url);
  }
}
