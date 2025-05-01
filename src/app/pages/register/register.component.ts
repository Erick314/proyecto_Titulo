import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  email = '';
  password = '';
  repeatPassword = '';

  constructor(private authService: AuthService) {}

  onRegister() {
    if (this.password !== this.repeatPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.authService
      .register(this.email, this.password)
      .then(() => alert('Registro exitoso'))
      .catch((err: unknown) => {
        if (err instanceof Error) {
          alert(err.message);
        } else {
          alert('Error inesperado');
        }
      });
  }
}
