import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/authentication/auth.service';

@Component({
  selector: 'app-recovery',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss'],
})
export class RecoveryComponent {
  email = '';

  constructor(private authService: AuthService) {}

  onRecover() {
    this.authService
      .recover(this.email)
      .then(() => alert('Revisa tu correo para restablecer la contraseña'))
      .catch((err: unknown) => {
        if (err instanceof Error) {
          alert(err.message);
        } else {
          alert('Error inesperado');
        }
      });
  }
}
