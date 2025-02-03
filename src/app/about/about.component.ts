import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css'],
    standalone: false
})
export class AboutComponent {
  constructor(private authService: AuthService) {}

  loggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  logOut() {
    this.authService.logout();
  }
}
