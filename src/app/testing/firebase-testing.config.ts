import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

// Mock de las funciones de Firebase Auth
const mockSignInWithEmailAndPassword = jasmine
  .createSpy('signInWithEmailAndPassword')
  .and.returnValue(Promise.resolve({ user: { uid: '123' } }));

const mockSignOut = jasmine
  .createSpy('signOut')
  .and.returnValue(Promise.resolve());

const mockCreateUserWithEmailAndPassword = jasmine
  .createSpy('createUserWithEmailAndPassword')
  .and.returnValue(Promise.resolve({ user: { uid: '123' } }));

const mockSendPasswordResetEmail = jasmine
  .createSpy('sendPasswordResetEmail')
  .and.returnValue(Promise.resolve());

// Mock de las funciones de Firebase Auth que se importan directamente
export const mockFirebaseAuthFunctions = {
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
  signOut: mockSignOut,
  createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
  sendPasswordResetEmail: mockSendPasswordResetEmail,
};

// Mocks para Firebase en pruebas unitarias
export const mockAuth = {
  signInWithEmailAndPassword: jasmine
    .createSpy('signInWithEmailAndPassword')
    .and.returnValue(Promise.resolve({ user: { uid: '123' } })),
  signOut: jasmine.createSpy('signOut').and.returnValue(Promise.resolve()),
  createUserWithEmailAndPassword: jasmine
    .createSpy('createUserWithEmailAndPassword')
    .and.returnValue(Promise.resolve({ user: { uid: '123' } })),
  sendPasswordResetEmail: jasmine
    .createSpy('sendPasswordResetEmail')
    .and.returnValue(Promise.resolve()),
  onAuthStateChanged: jasmine
    .createSpy('onAuthStateChanged')
    .and.returnValue(() => {}),
  currentUser: null,
  _getRecaptchaConfig: jasmine
    .createSpy('_getRecaptchaConfig')
    .and.returnValue(Promise.resolve(null)),
  isProviderEnabled: jasmine
    .createSpy('isProviderEnabled')
    .and.returnValue(Promise.resolve(true)),
  _delegate: {
    isProviderEnabled: jasmine
      .createSpy('_delegate.isProviderEnabled')
      .and.returnValue(Promise.resolve(true)),
    _getRecaptchaConfig: jasmine
      .createSpy('_delegate._getRecaptchaConfig')
      .and.returnValue(Promise.resolve(null)),
  },
  app: {
    name: '[DEFAULT]',
    options: {},
  },
  config: {
    apiKey: 'test-api-key',
    authDomain: 'test.firebaseapp.com',
  },
};

export const mockFirestore = {
  collection: jasmine.createSpy('collection').and.returnValue({
    add: jasmine
      .createSpy('add')
      .and.returnValue(Promise.resolve({ id: '123' })),
    doc: jasmine.createSpy('doc').and.returnValue({
      get: jasmine
        .createSpy('get')
        .and.returnValue(Promise.resolve({ data: () => ({ id: '123' }) })),
      set: jasmine.createSpy('set').and.returnValue(Promise.resolve()),
      update: jasmine.createSpy('update').and.returnValue(Promise.resolve()),
      delete: jasmine.createSpy('delete').and.returnValue(Promise.resolve()),
    }),
    where: jasmine.createSpy('where').and.returnValue({
      get: jasmine
        .createSpy('get')
        .and.returnValue(Promise.resolve({ docs: [] })),
    }),
    orderBy: jasmine.createSpy('orderBy').and.returnValue({
      get: jasmine
        .createSpy('get')
        .and.returnValue(Promise.resolve({ docs: [] })),
    }),
    limit: jasmine.createSpy('limit').and.returnValue({
      get: jasmine
        .createSpy('get')
        .and.returnValue(Promise.resolve({ docs: [] })),
    }),
  }),
};

// Providers para pruebas unitarias
export const firebaseUnitTestProviders = [
  {
    provide: Auth,
    useValue: mockAuth,
  },
  {
    provide: Firestore,
    useValue: mockFirestore,
  },
];

// Función para resetear los mocks
export function resetFirebaseMocks(): void {
  // Resetear todos los spies de Auth
  Object.values(mockAuth).forEach((value: any) => {
    if (value && typeof value.calls !== 'undefined') {
      value.calls.reset();
    }
  });

  // Resetear spies anidados en _delegate
  if (mockAuth._delegate) {
    Object.values(mockAuth._delegate).forEach((value: any) => {
      if (value && typeof value.calls !== 'undefined') {
        value.calls.reset();
      }
    });
  }

  // Resetear todos los spies de Firestore
  Object.values(mockFirestore).forEach((value: any) => {
    if (value && typeof value.calls !== 'undefined') {
      value.calls.reset();
    }
  });

  // Resetear spies anidados
  const collectionSpy = mockFirestore.collection as jasmine.Spy;
  if (collectionSpy.and.returnValue) {
    const collectionReturn = collectionSpy.and.returnValue;
    Object.values(collectionReturn).forEach((value: any) => {
      if (value && typeof value.calls !== 'undefined') {
        value.calls.reset();
      }
    });
  }
}

// Configuración de TestBed para pruebas unitarias
export function configureFirebaseUnitTest(): void {
  TestBed.configureTestingModule({
    providers: firebaseUnitTestProviders,
  });
}
