import { TestBed } from '@angular/core/testing';
import { ProveedorService } from './proveedor.service';
import { firebaseUnitTestProviders } from '../../testing/firebase-testing.config';

describe('ProveedorService', () => {
  let service: ProveedorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProveedorService, ...firebaseUnitTestProviders],
    });
    service = TestBed.inject(ProveedorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
