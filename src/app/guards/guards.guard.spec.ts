import { TestBed } from '@angular/core/testing';
import {
  CanActivateFn,
  CanActivateChildFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthStateService } from '../shared/data-access/auth/state.service';
import { privateGuard, publicGuard, privateChildGuard } from './guards.guard';

describe('Guards', () => {
  let mockAuthStateService: jasmine.SpyObj<AuthStateService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let authStateSubject: BehaviorSubject<any>;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let mockRouterStateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    // Crear mocks
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockAuthStateService = jasmine.createSpyObj('AuthStateService', [], {
      authState$: new BehaviorSubject(null),
    });
    authStateSubject = mockAuthStateService.authState$ as BehaviorSubject<any>;

    // Crear mocks para las rutas
    mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    mockRouterStateSnapshot = {} as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthStateService, useValue: mockAuthStateService },
      ],
    });
  });

  describe('privateGuard', () => {
    const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => privateGuard(...guardParameters));

    it('should be created', () => {
      expect(executeGuard).toBeTruthy();
    });

    it('should allow access when user is authenticated', (done) => {
      // Arrange
      const mockUser = { uid: '123', email: 'test@example.com' };
      authStateSubject.next(mockUser);

      // Act
      const result = executeGuard(
        mockActivatedRouteSnapshot,
        mockRouterStateSnapshot
      );

      if (result instanceof Observable) {
        result.subscribe((value) => {
          // Assert
          expect(value).toBe(true);
          expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
          done();
        });
      } else {
        expect(result).toBe(true);
        expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
        done();
      }
    });

    it('should deny access and redirect to login when user is not authenticated', (done) => {
      // Arrange
      authStateSubject.next(null);

      // Act
      const result = executeGuard(
        mockActivatedRouteSnapshot,
        mockRouterStateSnapshot
      );

      if (result instanceof Observable) {
        result.subscribe((value) => {
          // Assert
          expect(value).toBe(false);
          expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/login');
          done();
        });
      } else {
        expect(result).toBe(false);
        expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/login');
        done();
      }
    });

    it('should deny access when user is undefined', (done) => {
      // Arrange
      authStateSubject.next(undefined);

      // Act
      const result = executeGuard(
        mockActivatedRouteSnapshot,
        mockRouterStateSnapshot
      );

      if (result instanceof Observable) {
        result.subscribe((value) => {
          // Assert
          expect(value).toBe(false);
          expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/login');
          done();
        });
      } else {
        expect(result).toBe(false);
        expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/login');
        done();
      }
    });
  });

  describe('publicGuard', () => {
    const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => publicGuard(...guardParameters));

    it('should be created', () => {
      expect(executeGuard).toBeTruthy();
    });

    it('should allow access when user is not authenticated', (done) => {
      // Arrange
      authStateSubject.next(null);

      // Act
      const result = executeGuard(
        mockActivatedRouteSnapshot,
        mockRouterStateSnapshot
      );

      if (result instanceof Observable) {
        result.subscribe((value) => {
          // Assert
          expect(value).toBe(true);
          expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
          done();
        });
      } else {
        expect(result).toBe(true);
        expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
        done();
      }
    });

    it('should deny access and redirect to dashboard when user is authenticated', (done) => {
      // Arrange
      const mockUser = { uid: '123', email: 'test@example.com' };
      authStateSubject.next(mockUser);

      // Act
      const result = executeGuard(
        mockActivatedRouteSnapshot,
        mockRouterStateSnapshot
      );

      if (result instanceof Observable) {
        result.subscribe((value) => {
          // Assert
          expect(value).toBe(false);
          expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/dashboard');
          done();
        });
      } else {
        expect(result).toBe(false);
        expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/dashboard');
        done();
      }
    });

    it('should allow access when user is undefined', (done) => {
      // Arrange
      authStateSubject.next(undefined);

      // Act
      const result = executeGuard(
        mockActivatedRouteSnapshot,
        mockRouterStateSnapshot
      );

      if (result instanceof Observable) {
        result.subscribe((value) => {
          // Assert
          expect(value).toBe(true);
          expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
          done();
        });
      } else {
        expect(result).toBe(true);
        expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
        done();
      }
    });
  });

  describe('privateChildGuard', () => {
    const executeGuard: CanActivateChildFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() =>
        privateChildGuard(...guardParameters)
      );

    it('should be created', () => {
      expect(executeGuard).toBeTruthy();
    });

    it('should allow access to child routes when user is authenticated', (done) => {
      // Arrange
      const mockUser = { uid: '123', email: 'test@example.com' };
      authStateSubject.next(mockUser);

      // Act
      const result = executeGuard(
        mockActivatedRouteSnapshot,
        mockRouterStateSnapshot
      );

      if (result instanceof Observable) {
        result.subscribe((value) => {
          // Assert
          expect(value).toBe(true);
          expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
          done();
        });
      } else {
        expect(result).toBe(true);
        expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
        done();
      }
    });

    it('should deny access to child routes and redirect to login when user is not authenticated', (done) => {
      // Arrange
      authStateSubject.next(null);

      // Act
      const result = executeGuard(
        mockActivatedRouteSnapshot,
        mockRouterStateSnapshot
      );

      if (result instanceof Observable) {
        result.subscribe((value) => {
          // Assert
          expect(value).toBe(false);
          expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/login');
          done();
        });
      } else {
        expect(result).toBe(false);
        expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/login');
        done();
      }
    });

    it('should behave the same as privateGuard', (done) => {
      // Arrange
      const mockUser = { uid: '123', email: 'test@example.com' };
      authStateSubject.next(mockUser);

      // Act
      const result = executeGuard(
        mockActivatedRouteSnapshot,
        mockRouterStateSnapshot
      );

      if (result instanceof Observable) {
        result.subscribe((value) => {
          // Assert
          expect(value).toBe(true);
          done();
        });
      } else {
        expect(result).toBe(true);
        done();
      }
    });
  });

  describe('Edge Cases', () => {
    const executePrivateGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => privateGuard(...guardParameters));

    const executePublicGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => publicGuard(...guardParameters));

    it('should handle empty user object', (done) => {
      // Arrange
      authStateSubject.next({});

      // Act & Assert for privateGuard
      const privateResult = executePrivateGuard(
        mockActivatedRouteSnapshot,
        mockRouterStateSnapshot
      );

      if (privateResult instanceof Observable) {
        privateResult.subscribe((result) => {
          expect(result).toBe(true);

          // Act & Assert for publicGuard
          const publicResult = executePublicGuard(
            mockActivatedRouteSnapshot,
            mockRouterStateSnapshot
          );

          if (publicResult instanceof Observable) {
            publicResult.subscribe((publicValue) => {
              expect(publicValue).toBe(false);
              expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
                '/dashboard'
              );
              done();
            });
          } else {
            expect(publicResult).toBe(false);
            expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/dashboard');
            done();
          }
        });
      } else {
        expect(privateResult).toBe(true);

        const publicResult = executePublicGuard(
          mockActivatedRouteSnapshot,
          mockRouterStateSnapshot
        );

        if (publicResult instanceof Observable) {
          publicResult.subscribe((publicValue) => {
            expect(publicValue).toBe(false);
            expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/dashboard');
            done();
          });
        } else {
          expect(publicResult).toBe(false);
          expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/dashboard');
          done();
        }
      }
    });

    it('should handle user object with only uid', (done) => {
      // Arrange
      authStateSubject.next({ uid: '123' });

      // Act & Assert for privateGuard
      const privateResult = executePrivateGuard(
        mockActivatedRouteSnapshot,
        mockRouterStateSnapshot
      );

      if (privateResult instanceof Observable) {
        privateResult.subscribe((result) => {
          expect(result).toBe(true);

          // Act & Assert for publicGuard
          const publicResult = executePublicGuard(
            mockActivatedRouteSnapshot,
            mockRouterStateSnapshot
          );

          if (publicResult instanceof Observable) {
            publicResult.subscribe((publicValue) => {
              expect(publicValue).toBe(false);
              expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
                '/dashboard'
              );
              done();
            });
          } else {
            expect(publicResult).toBe(false);
            expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/dashboard');
            done();
          }
        });
      } else {
        expect(privateResult).toBe(true);

        const publicResult = executePublicGuard(
          mockActivatedRouteSnapshot,
          mockRouterStateSnapshot
        );

        if (publicResult instanceof Observable) {
          publicResult.subscribe((publicValue) => {
            expect(publicValue).toBe(false);
            expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/dashboard');
            done();
          });
        } else {
          expect(publicResult).toBe(false);
          expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/dashboard');
          done();
        }
      }
    });
  });
});
