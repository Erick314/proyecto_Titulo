import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/authentication/auth.service';
import {
  initializeFirebaseForIntegration,
  cleanupFirebaseForIntegration,
  firebaseIntegrationProviders,
} from '../../testing/firebase-integration.config';

describe('LoginComponent Integration Tests', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

  beforeAll(async () => {
    // Inicializar Firebase para todas las pruebas de integración
    initializeFirebaseForIntegration();
  });

  afterAll(async () => {
    // Limpiar Firebase después de todas las pruebas
    cleanupFirebaseForIntegration();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: LoginComponent },
          { path: 'login', component: LoginComponent },
        ]),
      ],
      providers: [AuthService, ...firebaseIntegrationProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  afterEach(async () => {
    // Limpiar sesión después de cada prueba
    try {
      await authService.logout();
    } catch (error) {
      // Ignorar errores de logout en pruebas
    }
  });

  it('should create component for integration tests', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form correctly for integration tests', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.get('correo')).toBeTruthy();
    expect(component.form.get('contrasenia')).toBeTruthy();
  });

  it('should have working validation methods in integration context', () => {
    expect(typeof component.isRequired).toBe('function');
    expect(typeof component.hasEmailError).toBe('function');
  });

  it('should validate required fields in integration context', () => {
    expect(component.isRequired('correo')).toBe(true);
    expect(component.isRequired('contrasenia')).toBe(true);
  });

  it('should validate email format in integration context', () => {
    const correoControl = component.form.get('correo');

    // Email válido
    correoControl?.setValue('test@example.com');
    correoControl?.markAsTouched();
    expect(component.hasEmailError('correo')).toBe(false);

    // Email inválido
    correoControl?.setValue('invalid-email');
    correoControl?.markAsTouched();
    expect(component.hasEmailError('correo')).toBe(true);
  });

  it('should handle email validation errors correctly in integration context', () => {
    const correoControl = component.form.get('correo');

    // Email vacío
    correoControl?.setValue('');
    correoControl?.markAsTouched();
    expect(component.hasEmailError('correo')).toBe(false); // No es error de email, es error required

    // Email con formato incorrecto
    correoControl?.setValue('not-an-email');
    correoControl?.markAsTouched();
    expect(component.hasEmailError('correo')).toBe(true);
  });
});
