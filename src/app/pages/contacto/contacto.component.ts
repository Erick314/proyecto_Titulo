import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card'; // Para las tarjetas de información
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Para notificaciones
import { toast } from 'ngx-sonner'; // Si sigues usando ngx-sonner

interface ContactoForm {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule, // Importar MatSnackBarModule
  ],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.scss',
})
export class ContactoComponent implements OnInit {
  contactForm: ContactoForm = {
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  };
  formSubmitted: boolean = false; // Para mostrar mensaje de éxito
  errorMessage: string = ''; // Para errores de validación

  constructor(private _snackBar: MatSnackBar) {} // Inyectar MatSnackBar

  ngOnInit(): void {}

  /**
   * Simula el envío del formulario de contacto.
   */
  enviarMensaje() {
    this.errorMessage = ''; // Limpiar errores previos
    this.formSubmitted = false; // Resetear estado de envío

    // Validación básica del formulario
    if (
      !this.contactForm.nombre ||
      !this.contactForm.email ||
      !this.contactForm.mensaje
    ) {
      this.errorMessage = 'Por favor, completa todos los campos obligatorios.';
      toast.error(this.errorMessage); // Usando ngx-sonner
      return;
    }

    if (!this.isValidEmail(this.contactForm.email)) {
      this.errorMessage = 'Por favor, introduce un correo electrónico válido.';
      toast.error(this.errorMessage); // Usando ngx-sonner
      return;
    }

    // Aquí simularías el envío a un servicio de backend (API)
    console.log('Enviando mensaje:', this.contactForm);

    // Simulación de éxito
    setTimeout(() => {
      this.formSubmitted = true;
      this.contactForm = {
        nombre: '',
        email: '',
        asunto: '',
        mensaje: '',
      }; // Limpiar formulario
      toast.success(
        '¡Tu mensaje ha sido enviado con éxito! Te responderemos pronto.'
      ); // Usando ngx-sonner
      console.log('Mensaje enviado con éxito.');
    }, 1000); // Simula un retraso de red
  }

  /**
   * Valida un formato de correo electrónico.
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
