import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, Validators, ReactiveFormsModule, FormBuilder} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { hasEmailError, isRequired, hasSixDigits} from '../../utils/validators';
import { toast } from 'ngx-sonner';
import { Usuario, UsuarioService } from '../../modelo/usuario/usuario.service';
export interface CrearUsuario {
  correo: FormControl<string | null>;
  contrasenia: FormControl<string | null>;
  repetirContrasenia: FormControl<string | null>;
  nombre: FormControl<string | null>;
  apellido: FormControl<string | null>;
  rol: FormControl<string | null>;
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
  private _authService = inject(AuthService);
  private _usuarioService = inject(UsuarioService)
  constructor() {}
  form = this._formBuilder.group<CrearUsuario>({
    correo: this._formBuilder.control('', [Validators.required, Validators.email]),
    contrasenia: this._formBuilder.control('', [Validators.required, Validators.minLength(6)]),
    repetirContrasenia: this._formBuilder.control('', [Validators.required, Validators.minLength(6)]),
    nombre: this._formBuilder.control('', Validators.required),
    apellido: this._formBuilder.control('', Validators.required),
    rol: this._formBuilder.control('Usuario')
  })

  isRequired(field: string){
    return isRequired(field, this.form);
  }
  hasEmailError(field: string){
    return hasEmailError(field, this.form);
  }
  hasSixDigits(field: string){
    return hasSixDigits(field, this.form)
  }

  onSubmit(){
    if (this.form.invalid) return;

    const { correo, contrasenia, repetirContrasenia, nombre, apellido, rol } = this.form.value;

    if (contrasenia !== repetirContrasenia) {toast.error('Contraseñas deben coincidir'); return }
    
    if (!correo || !contrasenia || !repetirContrasenia || !nombre || !apellido) return;
    
    const nuevoUsuario = { correo, nombre, apellido, rol } as Omit<Usuario, 'id'>;
    
    console.log(nuevoUsuario)
    
    this._authService
      .register(correo, contrasenia)
      .then(() => this._usuarioService.crear(nuevoUsuario))
      .then(() => toast.success('Registro exitoso'))
      .catch((err: unknown) => {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error('Error inesperado');
        }
      });
    console.log(this.form.getRawValue())
  }

}
