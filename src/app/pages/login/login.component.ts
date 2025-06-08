import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/authentication/auth.service';
import { hasEmailError, isRequired } from '../../utils/validators';
import { toast } from 'ngx-sonner';

export interface InicioSesion {
  correo: FormControl<string | null>;
  contrasenia: FormControl<string | null>;
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router)
  constructor() {}
  form = this._formBuilder.group<InicioSesion>({
    correo: this._formBuilder.control('', [Validators.required, Validators.email]),
    contrasenia: this._formBuilder.control('', Validators.required),
  })
  isRequired(field: string){
    return isRequired(field, this.form);
  }
  hasEmailError(field: string){
    return hasEmailError(field, this.form);
  }
  onSubmit(){
    const { correo, contrasenia } = this.form.value;
    if (correo == "" || !correo ) {toast.error("Ingrese Correo"); return};
    if (contrasenia == "" || !contrasenia) {toast.error("Ingrese contraseña"); return};
    if (this.form.invalid || contrasenia.length < 6) {toast.error('Correo y/o Contraseña incorrectos'); return};
    this._authService
      .login(correo, contrasenia)
      .then(() => { const tos = toast.success("Contraseña correcta, Redireccionando");
        setTimeout(() => {
          this._router.navigateByUrl('/dashboard/inventario');
          toast.dismiss();
        }, 2000);})
      .catch((err: unknown) => {
        if (err instanceof Error) {
          toast.error('Ocurrio un error inesperado' + err.message);
        } else {
          toast.error('Correo y/o Contraseña incorrecta');
        }
      });
  }
}
