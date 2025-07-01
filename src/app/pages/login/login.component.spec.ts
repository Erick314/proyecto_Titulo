import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/authentication/auth.service';
import { firebaseUnitTestProviders } from '../../testing/firebase-testing.config';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        ...firebaseUnitTestProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    // No llamamos fixture.detectChanges() para evitar que se renderice el template completo
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form.get('correo')?.value).toBe('');
    expect(component.form.get('contrasenia')?.value).toBe('');
  });

  it('should have required validators on form controls', () => {
    const correoControl = component.form.get('correo');
    const contraseniaControl = component.form.get('contrasenia');

    expect(correoControl?.hasError('required')).toBeTruthy();
    expect(contraseniaControl?.hasError('required')).toBeTruthy();
  });

  it('should have email validator on correo field', () => {
    const correoControl = component.form.get('correo');
    correoControl?.setValue('invalid-email');
    expect(correoControl?.hasError('email')).toBeTruthy();
  });

  it('should validate email format correctly', () => {
    const correoControl = component.form.get('correo');

    correoControl?.setValue('invalid-email');
    expect(correoControl?.hasError('email')).toBeTruthy();

    correoControl?.setValue('valid@email.com');
    expect(correoControl?.hasError('email')).toBeFalsy();
  });

  it('should return true for isRequired when field is empty', () => {
    expect(component.isRequired('correo')).toBeTruthy();
    expect(component.isRequired('contrasenia')).toBeTruthy();
  });

  it('should return false for isRequired when field has value', () => {
    component.form.patchValue({
      correo: 'test@example.com',
      contrasenia: 'password123',
    });

    expect(component.isRequired('correo')).toBeFalsy();
    expect(component.isRequired('contrasenia')).toBeFalsy();
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
