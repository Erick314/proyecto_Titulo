import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AppComponent } from './app.component';
import { firebaseUnitTestProviders } from './testing/firebase-testing.config';

describe('AppComponent', () => {
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate'], {
      url: '/dashboard',
    });

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        ...firebaseUnitTestProviders,
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have the correct title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('inventario');
  });

  it('should have menuOpen set to true by default', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.menuOpen).toBe(true);
  });

  it('should have hideNavbarRoutes defined', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.hideNavbarRoutes).toEqual(['/', '/register', '/recovery']);
  });

  it('should show navbar when not on hideNavbarRoutes', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    Object.defineProperty(mockRouter, 'url', {
      value: '/dashboard',
      writable: true,
    });
    expect(app.showNavbar).toBe(true);
  });

  it('should hide navbar when on login route', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    Object.defineProperty(mockRouter, 'url', { value: '/', writable: true });
    expect(app.showNavbar).toBe(false);
  });

  it('should hide navbar when on register route', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    Object.defineProperty(mockRouter, 'url', {
      value: '/register',
      writable: true,
    });
    expect(app.showNavbar).toBe(false);
  });

  it('should hide navbar when on recovery route', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    Object.defineProperty(mockRouter, 'url', {
      value: '/recovery',
      writable: true,
    });
    expect(app.showNavbar).toBe(false);
  });
});
