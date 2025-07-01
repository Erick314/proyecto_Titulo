import { TestBed } from '@angular/core/testing';
import { CrudService } from './crud.service';
import { firebaseUnitTestProviders } from '../../testing/firebase-testing.config';

// Interface de prueba para el servicio genérico
interface TestItem {
  id?: string;
  name: string;
  value: number;
}

describe('CrudService', () => {
  let service: CrudService<TestItem>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CrudService, ...firebaseUnitTestProviders],
    });
    service = TestBed.inject(CrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have required methods', () => {
    expect(typeof service.create).toBe('function');
    expect(typeof service.getAll).toBe('function');
    expect(typeof service.getById).toBe('function');
    expect(typeof service.update).toBe('function');
    expect(typeof service.delete).toBe('function');
  });
});
