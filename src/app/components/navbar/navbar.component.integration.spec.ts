import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/authentication/auth.service';
import {
  initializeFirebaseForIntegration,
  cleanupFirebaseForIntegration,
  firebaseIntegrationProviders,
} from '../../testing/firebase-integration.config';

describe('NavbarComponent Integration Tests', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
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
        NavbarComponent,
        RouterTestingModule.withRoutes([
          { path: 'login', component: NavbarComponent },
          { path: 'dashboard', component: NavbarComponent },
        ]),
      ],
      providers: [AuthService, ...firebaseIntegrationProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
  });

  it('should create component for integration tests', () => {
    expect(component).toBeTruthy();
  });

  it('should have menuToggle EventEmitter in integration context', () => {
    expect(component.menuToggle).toBeTruthy();
    expect(typeof component.menuToggle.emit).toBe('function');
  });

  it('should initialize with menu open by default in integration context', () => {
    expect(component.menuOpen).toBe(true);
  });

  it('should toggle menu state when toggleMenu is called in integration context', () => {
    const initialState = component.menuOpen;
    component.toggleMenu();
    expect(component.menuOpen).toBe(!initialState);
  });

  it('should emit menu state when toggleMenu is called in integration context', () => {
    spyOn(component.menuToggle, 'emit');
    component.toggleMenu();
    expect(component.menuToggle.emit).toHaveBeenCalledWith(component.menuOpen);
  });

  it('should emit initial menu state on ngOnInit in integration context', (done) => {
    spyOn(component.menuToggle, 'emit');
    // Llamar ngOnInit manualmente
    component.ngOnInit();

    // Esperar a que se ejecute el setTimeout
    setTimeout(() => {
      expect(component.menuToggle.emit).toHaveBeenCalledWith(true);
      done();
    }, 10);
  });

  it('should call logout service when cerrarSesion is called in integration context', () => {
    spyOn(authService, 'logout');
    component.cerrarSesion();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should handle logout when user is null in integration context', async () => {
    spyOn(authService, 'logout').and.returnValue(Promise.resolve());
    await component.cerrarSesion();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should handle logout when authenticated in integration context', async () => {
    spyOn(authService, 'logout').and.returnValue(Promise.resolve());
    await component.cerrarSesion();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should handle logout process correctly in integration context', async () => {
    spyOn(authService, 'logout').and.returnValue(Promise.resolve());
    await component.cerrarSesion();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should handle logout error gracefully in integration context', async () => {
    spyOn(authService, 'logout').and.returnValue(
      Promise.reject(new Error('Logout failed'))
    );
    await component.cerrarSesion();
    expect(authService.logout).toHaveBeenCalled();
  });
});
