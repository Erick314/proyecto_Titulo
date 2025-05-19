import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, Validators, ReactiveFormsModule, FormBuilder} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { hasEmailError, isRequired} from '../../utils/validators';
import { toast } from 'ngx-sonner';
export interface CrearUsuario {
  correo: FormControl<string | null>;
  contrasenia: FormControl<string | null>;
  repetirContrasenia: FormControl<string | null>;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService)
  constructor() {}
  form = this._formBuilder.group<CrearUsuario>({
    correo: this._formBuilder.control('', [Validators.required, Validators.email]),
    contrasenia: this._formBuilder.control('', Validators.required),
    repetirContrasenia: this._formBuilder.control('', Validators.required)
  })
  isRequired(field: 'correo' | 'contrasenia' | 'repetirContrasenia'){
    return isRequired(field, this.form);
  }
  hasEmailError(){
    return hasEmailError(this.form);
  }
  onSubmit(){
    if (this.form.invalid) return;
    const { correo, contrasenia, repetirContrasenia } = this.form.value;
    if (contrasenia !== repetirContrasenia) return;
    if (!correo || !contrasenia) return;
    this._authService
      .register(correo, contrasenia)
      .then(() => toast.success('Registro exitoso'))
      .catch((err: unknown) => {
        if (err instanceof Error) {
          toast.error('Error inesperado');
        } else {
          toast.error('Error inesperado');
        }
      });
    console.log(this.form.getRawValue())
  }
}
