import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.css'],
})
export class SignUpPageComponent {
  username: string = '';
  password: string = '';
  password_confirmation: string = '';

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/inventory']);
    }
  }

  onSubmit() {
    if (this.password !== this.password_confirmation) {
      console.log('Passwords do not match.');
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
        // handle sign-up error
      },
    });
  }
}
