import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Asegúrate de importar CommonModule
import { RouterModule } from '@angular/router'; // Asegúrate de importar RouterModule para routerLink

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule], // Añadir CommonModule y RouterModule
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss', // Asegúrate de que esto apunte a tu archivo SCSS
})
export class NotFoundComponent {}
