import { TestBed } from '@angular/core/testing';
import { MovimientosService } from './movimientos.service';
import { firebaseUnitTestProviders } from '../../testing/firebase-testing.config';

describe('MovimientosService', () => {
  let service: MovimientosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MovimientosService, ...firebaseUnitTestProviders],
    });
    service = TestBed.inject(MovimientosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
