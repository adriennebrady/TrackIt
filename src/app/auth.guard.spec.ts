import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);

    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
      ],
    });
    authGuard = TestBed.inject(AuthGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  describe('canActivate', () => {
    it('should return true for authenticated user', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);

      const canActivate = authGuard.canActivate(
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot
      );

      expect(canActivate).toBeTrue();
    });

    it('should return true for user with token in localStorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue('token');

      const canActivate = authGuard.canActivate(
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot
      );

      expect(canActivate).toBeTrue();
    });

    it('should redirect to login page for unauthenticated user', () => {
      authServiceSpy.isAuthenticated.and.returnValue(false);

      const canActivate = authGuard.canActivate(
        {} as ActivatedRouteSnapshot,
        { url: '/inventory' } as RouterStateSnapshot
      );

      expect(canActivate).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      expect(authServiceSpy.redirectUrl).toBe('/inventory');
    });
  });

  describe('checkLogin', () => {
    it('should return true for authenticated user', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);

      const checkLogin = authGuard.checkLogin('/inventory');

      expect(checkLogin).toBeTrue();
    });

    it('should return true for user with token in localStorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue('token');

      const checkLogin = authGuard.checkLogin('/inventory');

      expect(checkLogin).toBeTrue();
    });

    it('should redirect to login page for unauthenticated user', () => {
      authServiceSpy.isAuthenticated.and.returnValue(false);

      const checkLogin = authGuard.checkLogin('/inventory');

      expect(checkLogin).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      expect(authServiceSpy.redirectUrl).toBe('/inventory');
    });
  });
});
