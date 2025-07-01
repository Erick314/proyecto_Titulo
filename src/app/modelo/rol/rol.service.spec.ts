import { TestBed } from '@angular/core/testing';
import { RolService } from './rol.service';
import { firebaseUnitTestProviders } from '../../testing/firebase-testing.config';

describe('RolService', () => {
  let service: RolService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RolService, ...firebaseUnitTestProviders],
    });
    service = TestBed.inject(RolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
