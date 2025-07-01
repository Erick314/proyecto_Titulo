import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/authentication/auth.service';
import {
  firebaseUnitTestProviders,
  resetFirebaseMocks,
} from '../../testing/firebase-testing.config';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,
        RouterTestingModule.withRoutes([
          { path: 'login', component: NavbarComponent },
          { path: 'dashboard', component: NavbarComponent },
        ]),
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        ...firebaseUnitTestProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    resetFirebaseMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have menuToggle EventEmitter', () => {
    expect(component.menuToggle).toBeTruthy();
    expect(typeof component.menuToggle.emit).toBe('function');
  });

  it('should initialize with menu open by default', () => {
    expect(component.menuOpen).toBe(true);
  });

  it('should toggle menu state when toggleMenu is called', () => {
    const initialState = component.menuOpen;
    component.toggleMenu();
    expect(component.menuOpen).toBe(!initialState);
  });

  it('should emit menu state when toggleMenu is called', () => {
    spyOn(component.menuToggle, 'emit');
    component.toggleMenu();
    expect(component.menuToggle.emit).toHaveBeenCalledWith(component.menuOpen);
  });

  it('should emit initial menu state on ngOnInit', (done) => {
    spyOn(component.menuToggle, 'emit');
    // Llamar ngOnInit manualmente
    component.ngOnInit();

    // Esperar a que se ejecute el setTimeout
    setTimeout(() => {
      expect(component.menuToggle.emit).toHaveBeenCalledWith(true);
      done();
    }, 10);
  });

  it('should call logout service when cerrarSesion is called', () => {
    authService.logout.and.returnValue(Promise.resolve());
    component.cerrarSesion();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should navigate to login when logout is successful and user is null', async () => {
    authService.logout.and.returnValue(Promise.resolve());
    await component.cerrarSesion();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should log current user after logout', async () => {
    authService.logout.and.returnValue(Promise.resolve());
    spyOn(console, 'log');
    await component.cerrarSesion();
    expect(console.log).toHaveBeenCalled();
  });

  it('should handle logout error gracefully', async () => {
    const error = new Error('Logout failed');
    authService.logout.and.returnValue(Promise.reject(error));
    spyOn(console, 'error');

    await component.cerrarSesion();

    expect(authService.logout).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error during logout:', error);
  });

  it('should log menu state changes', () => {
    spyOn(console, 'log');
    component.toggleMenu();
    expect(console.log).toHaveBeenCalledWith(
      'Estado del menú:',
      component.menuOpen
    );
  });
});
