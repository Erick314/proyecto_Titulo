import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventarioComponent } from './inventario.component';
import { InventarioService } from '../../modelo/inventario/inventario.service';
import { firebaseUnitTestProviders } from '../../testing/firebase-testing.config';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('InventarioComponent', () => {
  let component: InventarioComponent;
  let fixture: ComponentFixture<InventarioComponent>;
  let mockInventarioService: jasmine.SpyObj<InventarioService>;

  beforeEach(async () => {
    mockInventarioService = jasmine.createSpyObj('InventarioService', [
      'listar',
      'crear',
      'actualizar',
      'eliminar',
    ]);

    await TestBed.configureTestingModule({
      imports: [InventarioComponent, NoopAnimationsModule],
      providers: [
        { provide: InventarioService, useValue: mockInventarioService },
        ...firebaseUnitTestProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InventarioComponent);
    component = fixture.componentInstance;

    // No llamamos fixture.detectChanges() para evitar que se ejecute ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
