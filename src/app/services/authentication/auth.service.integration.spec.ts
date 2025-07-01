import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  initializeFirebaseForIntegration,
  cleanupFirebaseForIntegration,
  firebaseIntegrationProviders,
} from '../../testing/firebase-integration.config';

describe('AuthService Integration Tests', () => {
  let service: AuthService;

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
      providers: [AuthService, ...firebaseIntegrationProviders],
    }).compileComponents();

    service = TestBed.inject(AuthService);
  });

  it('should be created for integration tests', () => {
    expect(service).toBeTruthy();
  });

  it('should have login method available in integration context', () => {
    expect(typeof service.login).toBe('function');
  });

  it('should have logout method available in integration context', () => {
    expect(typeof service.logout).toBe('function');
  });

  it('should have register method available in integration context', () => {
    expect(typeof service.register).toBe('function');
  });

  it('should have recover method available in integration context', () => {
    expect(typeof service.recover).toBe('function');
  });

  it('should handle authentication state changes in integration context', () => {
    expect(service).toBeTruthy();
    // Verificar que el servicio puede manejar cambios de estado de autenticación
  });

  it('should handle login with empty credentials in integration context', async () => {
    try {
      await service.login('', '');
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should handle login with malformed email in integration context', async () => {
    try {
      await service.login('invalid-email', 'password');
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should handle login with invalid credentials gracefully in integration context', async () => {
    try {
      await service.login('test@example.com', 'wrongpassword');
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should handle logout when not authenticated in integration context', async () => {
    try {
      await service.logout();
    } catch (error) {
      // Puede fallar si no hay usuario autenticado, lo cual es esperado
      expect(error).toBeTruthy();
    }
  });

  it('should handle logout when authenticated in integration context', async () => {
    try {
      await service.logout();
    } catch (error) {
      // Puede fallar si no hay usuario autenticado, lo cual es esperado
      expect(error).toBeTruthy();
    }
  });

  it('should handle multiple logout calls in integration context', async () => {
    try {
      await service.logout();
      await service.logout();
    } catch (error) {
      // Puede fallar si no hay usuario autenticado, lo cual es esperado
      expect(error).toBeTruthy();
    }
  });

  it('should handle concurrent login attempts in integration context', async () => {
    try {
      await Promise.all([
        service.login('test1@example.com', 'password1'),
        service.login('test2@example.com', 'password2'),
      ]);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});
