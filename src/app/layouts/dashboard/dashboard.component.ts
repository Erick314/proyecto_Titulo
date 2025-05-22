// src/app/layouts/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component'; // La ruta correcta a tu Navbar.
// (He ajustado la ruta aquí a '../../navbar/navbar.component';
// por favor, verifica si es '../components/navbar/navbar.component'
// o si es solo '../navbar/navbar.component' según tu estructura real).

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  isMenuOpen: boolean = true; // Inicializa el estado del menú a abierto por defecto

  constructor() {}

  ngOnInit(): void {
    // Aquí podrías cargar el estado inicial del menú desde localStorage si lo guardaras
    // this.isMenuOpen = localStorage.getItem('isMenuOpen') === 'true';
    // O simplemente usar el valor por defecto o esperar el primer evento del Navbar.
  }

  // Este método será llamado por el NavbarComponent cuando cambie su estado del menú
  onMenuToggle(isOpen: boolean) {
    this.isMenuOpen = isOpen;
    console.log(
      'Dashboard: El menú ahora está',
      this.isMenuOpen ? 'abierto' : 'cerrado'
    );
  }
}
