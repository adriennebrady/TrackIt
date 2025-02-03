import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css'],
    standalone: false
})
export class LoginPageComponent {
  username: string = '';
  password: string = '';
  loginError: string = '';

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/inventory']);
    }
  }

  onSubmit() {
    this.loginError = ''; // Clear any previous errors
    const user = {
      username: this.username,
      password: this.password,
    };

    this.authService.login(user).subscribe(
      (result) => {
        // handle successful login
        this.authService.loginSuccess();
        if (this.authService.redirectUrl != '') {
          this.router.navigate([this.authService.redirectUrl]);
          this.authService.redirectUrl = '';
        } else {
          this.router.navigate(['/inventory']);
        }
      },
      (error) => {
        // handle login error
        this.loginError = 'Invalid username or password';
      }
    );
  }
}