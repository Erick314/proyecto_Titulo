import { TestBed } from '@angular/core/testing';
import { FacturaService } from './factura.service';
import { firebaseUnitTestProviders } from '../../testing/firebase-testing.config';

describe('FacturaService', () => {
  let service: FacturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FacturaService, ...firebaseUnitTestProviders],
    });
    service = TestBed.inject(FacturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
