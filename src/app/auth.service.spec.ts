import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    providers: [AuthService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('token');
    localStorage.removeItem('rootloc');
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should signup a user', () => {
    const user = {
      username: 'testuser',
      password: 'testpassword',
      password_confirmation: 'testpassword',
    };

    authService.signup(user).subscribe((result) => {
      expect(result).toBeTruthy();
      expect(localStorage.getItem('token')).toBeTruthy();
      expect(localStorage.getItem('rootloc')).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/register');
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'testtoken', LocID: 1 });
  });

  it('should login a user', () => {
    const user = {
      username: 'testuser',
      password: 'testpassword',
    };

    authService.login(user).subscribe((result) => {
      expect(result).toBeTruthy();
      expect(localStorage.getItem('token')).toBeTruthy();
      expect(localStorage.getItem('rootloc')).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'testtoken', LocID: 1 });
  });

  it('should logout a user', () => {
    authService.isLoggedIn = true;
    authService.token = 'testtoken';
    localStorage.setItem('token', authService.token);

    authService.rootloc = 1;
    localStorage.setItem('rootloc', authService.rootloc.toString());

    authService.logout();

    expect(authService.isLoggedIn).toBeFalsy();
    expect(authService.token).toBeFalsy();
    expect(localStorage.getItem('token')).toBeFalsy();
    expect(localStorage.getItem('rootloc')).toBeFalsy();
  });

  it('should return true if the user is authenticated', () => {
    authService.isLoggedIn = true;
    expect(authService.isAuthenticated()).toBeTruthy();
  });

  it('should return the token', () => {
    authService.token = 'testtoken';
    expect(authService.getToken()).toBe('testtoken');
  });
});
