import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NotFoundComponent } from './not-found.component';
import { firebaseUnitTestProviders } from '../../testing/firebase-testing.config';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [NotFoundComponent, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: Router, useValue: mockRouter },
        ...firebaseUnitTestProviders,
      ],
    })
      .overrideComponent(NotFoundComponent, {
        set: {
          imports: [RouterTestingModule],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 404 error message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('404');
  });

  it('should render page not found message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(
      '¡Ups! La página que buscas no se pudo encontrar.'
    );
  });

  it('should have a link to go back home', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector(
      'button[routerLink="/dashboard/facturas"]'
    );
    expect(link).toBeTruthy();
  });
});
