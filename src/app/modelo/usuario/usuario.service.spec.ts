import { TestBed } from '@angular/core/testing';
import { UsuarioService } from './usuario.service';
import { firebaseUnitTestProviders } from '../../testing/firebase-testing.config';

describe('UsuarioService', () => {
  let service: UsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsuarioService, ...firebaseUnitTestProviders],
    });
    service = TestBed.inject(UsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
