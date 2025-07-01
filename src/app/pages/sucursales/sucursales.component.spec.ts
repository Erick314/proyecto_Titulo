import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SucursalesComponent } from './sucursales.component';
import { SucursalService } from '../../modelo/sucursal/sucursal.service';
import { firebaseUnitTestProviders } from '../../testing/firebase-testing.config';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SucursalesComponent', () => {
  let component: SucursalesComponent;
  let fixture: ComponentFixture<SucursalesComponent>;
  let mockSucursalService: jasmine.SpyObj<SucursalService>;

  beforeEach(async () => {
    mockSucursalService = jasmine.createSpyObj('SucursalService', [
      'listar',
      'crear',
      'actualizar',
      'eliminar',
    ]);

    await TestBed.configureTestingModule({
      imports: [SucursalesComponent, NoopAnimationsModule],
      providers: [
        { provide: SucursalService, useValue: mockSucursalService },
        ...firebaseUnitTestProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SucursalesComponent);
    component = fixture.componentInstance;

    // No llamamos fixture.detectChanges() para evitar que se ejecute ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
