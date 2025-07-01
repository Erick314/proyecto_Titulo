import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import {
  provideFirebaseApp,
  initializeApp,
  getApps,
  deleteApp,
} from '@angular/fire/app';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import {
  provideFirestore,
  getFirestore,
  connectFirestoreEmulator,
} from '@angular/fire/firestore';

// Configuración para pruebas de integración con Firebase Emulator
export const firebaseIntegrationConfig = {
  apiKey: 'test-api-key',
  authDomain: 'test-project.firebaseapp.com',
  projectId: 'test-project',
  storageBucket: 'test-project.appspot.com',
  messagingSenderId: '123456789',
  appId: 'test-app-id',
};

// Variable global para mantener la instancia de Firebase de prueba
let testFirebaseApp: any = null;
let testAuth: any = null;
let testFirestore: any = null;

// Inicializar Firebase para pruebas de integración
export function initializeFirebaseForIntegration(): void {
  try {
    // Obtener todas las apps existentes y eliminarlas
    const existingApps = getApps();
    existingApps.forEach((app) => {
      if (app.name === '[DEFAULT]') {
        deleteApp(app);
      }
    });

    // Inicializar nueva app con configuración de prueba
    testFirebaseApp = initializeApp(firebaseIntegrationConfig, 'test-app');
    testAuth = getAuth(testFirebaseApp);
    testFirestore = getFirestore(testFirebaseApp);

    // Conectar a emuladores si están disponibles
    try {
      connectAuthEmulator(testAuth, 'http://localhost:9099');
      connectFirestoreEmulator(testFirestore, 'localhost', 8080);
    } catch (error) {
      console.warn('Firebase emulators not available, using real Firebase');
    }
  } catch (error) {
    console.error('Error initializing Firebase for integration tests:', error);
  }
}

// Limpiar Firebase después de las pruebas
export function cleanupFirebaseForIntegration(): void {
  try {
    if (testFirebaseApp) {
      deleteApp(testFirebaseApp);
      testFirebaseApp = null;
      testAuth = null;
      testFirestore = null;
    }
  } catch (error) {
    console.error('Error cleaning up Firebase:', error);
  }
}

// Providers para pruebas de integración que usan la app de prueba
export const firebaseIntegrationProviders = [
  provideFirebaseApp(
    () =>
      testFirebaseApp || initializeApp(firebaseIntegrationConfig, 'test-app')
  ),
  provideAuth(
    () =>
      testAuth ||
      getAuth(
        testFirebaseApp || initializeApp(firebaseIntegrationConfig, 'test-app')
      )
  ),
  provideFirestore(
    () =>
      testFirestore ||
      getFirestore(
        testFirebaseApp || initializeApp(firebaseIntegrationConfig, 'test-app')
      )
  ),
];

// Función para obtener la instancia de Auth
export function getTestAuth() {
  return testAuth;
}

// Función para obtener la instancia de Firestore
export function getTestFirestore() {
  return testFirestore;
}
