import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacturasComponent } from './facturas.component';
import { FacturaService } from '../../modelo/factura/factura.service';
import { firebaseUnitTestProviders } from '../../testing/firebase-testing.config';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('FacturasComponent', () => {
  let component: FacturasComponent;
  let fixture: ComponentFixture<FacturasComponent>;
  let mockFacturaService: jasmine.SpyObj<FacturaService>;

  beforeEach(async () => {
    mockFacturaService = jasmine.createSpyObj('FacturaService', [
      'listar',
      'crear',
      'actualizar',
      'eliminar',
    ]);

    await TestBed.configureTestingModule({
      imports: [FacturasComponent, NoopAnimationsModule],
      providers: [
        { provide: FacturaService, useValue: mockFacturaService },
        ...firebaseUnitTestProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FacturasComponent);
    component = fixture.componentInstance;

    // No llamamos fixture.detectChanges() para evitar que se ejecute ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
