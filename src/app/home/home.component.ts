import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: false
})
export class HomeComponent {
  constructor(private authService: AuthService) {}

  loggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  logOut() {
    this.authService.logout();
  }
}
