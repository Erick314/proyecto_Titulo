import { TestBed } from '@angular/core/testing';
import { ProductoService } from './producto.service';
import { firebaseUnitTestProviders } from '../../testing/firebase-testing.config';

describe('ProductoService', () => {
  let service: ProductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductoService, ...firebaseUnitTestProviders],
    });
    service = TestBed.inject(ProductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
