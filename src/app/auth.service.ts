import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

interface NewUser {
  username: string;
  password: string;
  password_confirmation: string;
}

interface User {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  LocID: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn: boolean = false;
  token: string = '';
  rootloc: number = -1;
  public redirectUrl: string = '';

  constructor(private http: HttpClient, private router: Router) {
    const storedToken = localStorage.getItem('token');
    const storedRootLoc = localStorage.getItem('rootloc');

    if (storedToken) {
      this.token = storedToken;
      this.isLoggedIn = true;
    }

    if (storedRootLoc) {
      this.rootloc = parseInt(storedRootLoc, 10);
    }
  }

  signup(user: NewUser): Observable<boolean> {
    return this.http.post<LoginResponse>('/api/register', user).pipe(
      map((response: LoginResponse) => {
        this.token = response.token;
        localStorage.setItem('token', this.token);

        this.rootloc = response.LocID;
        localStorage.setItem('rootloc', this.rootloc.toString());

        localStorage.setItem('user', user.username);

        return true;
      })
    );
  }

  login(user: User): Observable<boolean> {
    return this.http.post<LoginResponse>('/api/login', user).pipe(
      map((response: LoginResponse) => {
        this.token = response.token;
        localStorage.setItem('token', this.token);

        this.rootloc = response.LocID;
        localStorage.setItem('rootloc', this.rootloc.toString());

        localStorage.setItem('user', user.username);

        if (this.redirectUrl) {
          this.router.navigate([this.redirectUrl]);
        }

        return true;
      })
    );
  }

  loginSuccess(): void {
    this.isLoggedIn = true;
  }

  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('token');
    localStorage.removeItem('rootloc');
    localStorage.removeItem('user');
    this.token = '';
    this.rootloc = -1;

    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.token && this.isLoggedIn;
  }

  getToken(): string {
    return this.token;
  }

  redirectIfAuthenticated(): void {
    if (this.isAuthenticated()) {
      this.router.navigate(['/inventory']);
    }
  }
}
