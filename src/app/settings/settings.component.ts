import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAccountDialogComponent } from './delete-account-dialog/delete-account-dialog.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    standalone: false
})
export class SettingsComponent {
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  logOut() {
    this.authService.logout();
  }

  openConfirmDialog() {
    const dialogRef = this.dialog.open(DeleteAccountDialogComponent, {
      width: '260px',
      data: { password: '', confirmpass: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteAccount(result.password, result.confirmpass);
      }
    });
  }

  deleteAccount(pass: string, confirm: string) {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;
    const username: string = localStorage.getItem('user')!;

    const authorization = {
      Authorization: authToken,
    };

    const user = {
      username: username,
      password: pass,
      password_confirmation: confirm,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: authorization.Authorization,
      }),
      body: user,
    };

    this.http.delete('/api/account', httpOptions).subscribe((response) => {
      this.logOut();
      this.router.navigate(['/home']);
    });
  }
}
