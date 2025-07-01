import { TestBed } from '@angular/core/testing';
import { SucursalService } from './sucursal.service';
import { firebaseUnitTestProviders } from '../../testing/firebase-testing.config';

describe('SucursalService', () => {
  let service: SucursalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SucursalService, ...firebaseUnitTestProviders],
    });
    service = TestBed.inject(SucursalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
