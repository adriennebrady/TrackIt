import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sign-up-page',
    templateUrl: './sign-up-page.component.html',
    styleUrls: ['./sign-up-page.component.css'],
    standalone: false
})
export class SignUpPageComponent {
  username: string = '';
  password: string = '';
  password_confirmation: string = '';
  signupError: string = '';

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/inventory']);
    }
  }

  onSubmit() {
    // Reset previous errors
    this.signupError = '';

    // Password match validation
    if (this.password !== this.password_confirmation) {
      this.signupError = 'Passwords do not match.';
      return;
    }

    const user = {
      username: this.username,
      password: this.password,
      password_confirmation: this.password_confirmation,
    };

    this.authService.signup(user).subscribe({
      next: (result) => {
        // handle successful sign-up
        this.authService.loginSuccess();
        this.router.navigate(['/inventory']);
      },
      error: (error) => {
        // Handle specific error scenarios
        if (error.error && error.error.error) {
          if (error.error.error === 'User already exists') {
            this.signupError = 'Username is already taken. Please choose a different username.';
          } else {
            this.signupError = error.error.error || 'An error occurred during sign-up';
          }
        } else {
          this.signupError = 'An unexpected error occurred. Please try again.';
        }
      },
    });
  }
}