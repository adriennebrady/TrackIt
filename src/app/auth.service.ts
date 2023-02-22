import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

interface newUser {
  username: string;
  password: string;
  password_confirmation: string;
}

interface user {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn: boolean = false;
  token: string = '';
  public redirectUrl: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  signup(user: newUser): Observable<boolean> {
    return this.http.post<LoginResponse>('/api/register', user).pipe(
      map((response) => {
        this.token = response.token;
        localStorage.setItem('token', this.token);
        return true;
      })
    );
  }

  login(user: user) {
    return this.http.post<LoginResponse>('/api/login', user).pipe(
      map((response) => {
        this.token = response.token;
        localStorage.setItem('token', this.token);
        if (this.redirectUrl) {
          this.router.navigate([this.redirectUrl]);
        }
        return true;
      })
    );
  }

  loginSuccess() {
    this.isLoggedIn = true;
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('token');
    this.token = '';
  }

  isAuthenticated() {
    return this.isLoggedIn;
  }

  getToken(): string {
    return this.token;
  }
}
