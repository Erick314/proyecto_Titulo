import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProveedoresComponent } from './proveedores.component';
import { ProveedorService } from '../../modelo/proveedor/proveedor.service';
import { firebaseUnitTestProviders } from '../../testing/firebase-testing.config';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProveedoresComponent', () => {
  let component: ProveedoresComponent;
  let fixture: ComponentFixture<ProveedoresComponent>;
  let mockProveedorService: jasmine.SpyObj<ProveedorService>;

  beforeEach(async () => {
    mockProveedorService = jasmine.createSpyObj('ProveedorService', [
      'listar',
      'crear',
      'actualizar',
      'eliminar',
    ]);

    await TestBed.configureTestingModule({
      imports: [ProveedoresComponent, NoopAnimationsModule],
      providers: [
        { provide: ProveedorService, useValue: mockProveedorService },
        ...firebaseUnitTestProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProveedoresComponent);
    component = fixture.componentInstance;

    // No llamamos fixture.detectChanges() para evitar que se ejecute ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
