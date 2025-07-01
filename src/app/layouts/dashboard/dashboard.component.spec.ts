import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardComponent } from './dashboard.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { firebaseUnitTestProviders } from '../../testing/firebase-testing.config';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        NavbarComponent,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        ...firebaseUnitTestProviders,
      ],
    })
      .overrideComponent(DashboardComponent, {
        set: {
          imports: [RouterTestingModule, NavbarComponent],
        },
      })
      .overrideComponent(NavbarComponent, {
        set: {
          imports: [RouterTestingModule],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with menu open by default', () => {
    expect(component.isMenuOpen).toBe(true);
  });

  it('should update menu state when onMenuToggle is called', () => {
    // Test closing menu
    component.onMenuToggle(false);
    expect(component.isMenuOpen).toBe(false);

    // Test opening menu
    component.onMenuToggle(true);
    expect(component.isMenuOpen).toBe(true);
  });

  it('should log menu state changes', () => {
    spyOn(console, 'log');

    component.onMenuToggle(false);
    expect(console.log).toHaveBeenCalledWith(
      'Dashboard: El menú ahora está',
      'cerrado'
    );

    component.onMenuToggle(true);
    expect(console.log).toHaveBeenCalledWith(
      'Dashboard: El menú ahora está',
      'abierto'
    );
  });

  it('should implement OnInit interface', () => {
    expect(typeof component.ngOnInit).toBe('function');
  });

  it('should call ngOnInit without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });
});
