import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/authentication/auth.service';
import { UsuarioService } from '../../modelo/usuario/usuario.service';
import { firebaseUnitTestProviders } from '../../testing/firebase-testing.config';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockUsuarioService: jasmine.SpyObj<UsuarioService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['register']);
    mockUsuarioService = jasmine.createSpyObj('UsuarioService', ['crear']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        CommonModule,
        RouterTestingModule.withRoutes([]),
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsuarioService, useValue: mockUsuarioService },
        ...firebaseUnitTestProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form.get('correo')?.value).toBe('');
    expect(component.form.get('contrasenia')?.value).toBe('');
    expect(component.form.get('repetirContrasenia')?.value).toBe('');
    expect(component.form.get('nombre')?.value).toBe('');
    expect(component.form.get('apellido')?.value).toBe('');
    expect(component.form.get('rol')?.value).toBe('Usuario');
  });

  it('should have required validators on form controls', () => {
    const correoControl = component.form.get('correo');
    const contraseniaControl = component.form.get('contrasenia');
    const repetirContraseniaControl = component.form.get('repetirContrasenia');
    const nombreControl = component.form.get('nombre');
    const apellidoControl = component.form.get('apellido');

    expect(correoControl?.hasError('required')).toBeTruthy();
    expect(contraseniaControl?.hasError('required')).toBeTruthy();
    expect(repetirContraseniaControl?.hasError('required')).toBeTruthy();
    expect(nombreControl?.hasError('required')).toBeTruthy();
    expect(apellidoControl?.hasError('required')).toBeTruthy();
  });

  it('should have email validator on correo field', () => {
    const correoControl = component.form.get('correo');
    correoControl?.setValue('invalid-email');
    expect(correoControl?.hasError('email')).toBeTruthy();
  });

  it('should have minLength validator on password fields', () => {
    const contraseniaControl = component.form.get('contrasenia');
    const repetirContraseniaControl = component.form.get('repetirContrasenia');

    contraseniaControl?.setValue('123');
    expect(contraseniaControl?.hasError('minlength')).toBeTruthy();

    repetirContraseniaControl?.setValue('123');
    expect(repetirContraseniaControl?.hasError('minlength')).toBeTruthy();
  });

  it('should call register and crear when form is valid', () => {
    mockAuthService.register.and.returnValue(Promise.resolve({} as any));
    mockUsuarioService.crear.and.returnValue(Promise.resolve({} as any));

    component.form.patchValue({
      correo: 'test@example.com',
      contrasenia: 'password123',
      repetirContrasenia: 'password123',
      nombre: 'John',
      apellido: 'Doe',
      rol: 'Usuario',
    });

    component.onSubmit();
    expect(mockAuthService.register).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
  });

  it('should not submit when form is invalid', () => {
    component.onSubmit();
    expect(mockAuthService.register).not.toHaveBeenCalled();
  });

  it('should not submit when passwords do not match', () => {
    component.form.patchValue({
      correo: 'test@example.com',
      contrasenia: 'password123',
      repetirContrasenia: 'differentpassword',
      nombre: 'John',
      apellido: 'Doe',
      rol: 'Usuario',
    });

    component.onSubmit();
    expect(mockAuthService.register).not.toHaveBeenCalled();
  });

  it('should return true for isRequired when field is empty', () => {
    expect(component.isRequired('correo')).toBeTruthy();
    expect(component.isRequired('contrasenia')).toBeTruthy();
    expect(component.isRequired('nombre')).toBeTruthy();
    expect(component.isRequired('apellido')).toBeTruthy();
  });

  it('should return false for isRequired when field has value', () => {
    component.form.patchValue({
      correo: 'test@example.com',
      contrasenia: 'password123',
      repetirContrasenia: 'password123',
      nombre: 'John',
      apellido: 'Doe',
      rol: 'Usuario',
    });

    expect(component.isRequired('correo')).toBeFalsy();
    expect(component.isRequired('contrasenia')).toBeFalsy();
    expect(component.isRequired('nombre')).toBeFalsy();
    expect(component.isRequired('apellido')).toBeFalsy();
  });

  it('should return true for hasSixDigits when password is too short', () => {
    const contraseniaControl = component.form.get('contrasenia');
    contraseniaControl?.setValue('123');
    contraseniaControl?.markAsTouched();

    expect(component.hasSixDigits('contrasenia')).toBeTruthy();
  });

  it('should return false for hasSixDigits when password is long enough', () => {
    const contraseniaControl = component.form.get('contrasenia');
    contraseniaControl?.setValue('password123');
    contraseniaControl?.markAsTouched();

    expect(component.hasSixDigits('contrasenia')).toBeFalsy();
  });

  it('should return true for hasEmailError when email is invalid', () => {
    const correoControl = component.form.get('correo');
    correoControl?.setValue('invalid-email');
    correoControl?.markAsTouched();

    expect(component.hasEmailError('correo')).toBeTruthy();
  });

  it('should return false for hasEmailError when email is valid', () => {
    const correoControl = component.form.get('correo');
    correoControl?.setValue('valid@email.com');
    correoControl?.markAsTouched();

    expect(component.hasEmailError('correo')).toBeFalsy();
  });
});
