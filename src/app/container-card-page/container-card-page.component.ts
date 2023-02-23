import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../inventory-page/dialog/dialog.component';
import { ConfirmDialogComponent } from '../inventory-page/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { RenameDialogComponent } from '../inventory-page/rename-dialog/rename-dialog.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';

interface InvItem {
  Name: string;
  Location: string;
}

@Component({
  selector: 'app-container-card-page',
  templateUrl: './container-card-page.component.html',
  styleUrls: ['./container-card-page.component.css'],
})
export class ContainerCardPageComponent implements OnInit {
  containerId: number = -1;
  items: InvItem[] = [];

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  backClicked() {
    this.location.back();
  }

  logOut() {
    this.authService.logout();
  }

  getInventory() {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;

    const authorization = {
      Authorization: authToken,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: authorization.Authorization,
      }),
    };

    this.http
      .get<{ [key: string]: InvItem }>('/api/inventory', httpOptions)
      .subscribe((items) => {
        this.items = Object.values(items);
        this.cdRef.detectChanges();
        console.log(this.items);
      });
  }

  createItem(newName: string) {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;

    const newItem = {
      Authorization: authToken,
      Kind: 'Item',
      Name: newName,
      Location: 'top shelf',
      Type: 'Add',
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: newItem.Authorization,
      }),
    };

    this.http
      .post('/api/inventory', newItem, httpOptions)
      .subscribe((response) => {
        console.log(response);
      });

    this.getInventory();
  }

  ngOnInit() {
    this.getInventory();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.containerId = +id;
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: Object.entries({ name: '', description: '' }),
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createItem(result.name);
      }
    });
  }

  removeItem(index: number) {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;

    const authorization = {
      Authorization: authToken,
    };

    const itemName = {
      Name: this.items[index].Name,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: authorization.Authorization,
      }),
      body: itemName,
    };

    this.http.delete('/api/inventory', httpOptions).subscribe((response) => {
      console.log(response);
      this.items.splice(index, 1);
    });

    this.getInventory();
  }

  openConfirmDialog(index: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { name: this.items[index].Name },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.removeItem(index);
      }
    });
  }

  openRenameDialog(index: number) {
    const dialogRef = this.dialog.open(RenameDialogComponent, {
      width: '300px',
      data: { name: this.items[index].Name },
    });

    dialogRef.afterClosed().subscribe((newName: string) => {
      if (newName) {
        this.renameItem(index, newName);
      }
    });
  }

  renameItem(index: number, newName: string) {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;

    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + authToken
    );

    // Set the HTTP options with the headers
    const options = {
      headers: headers,
    };

    const newItem = {
      name: this.items[index].Name,
      location: newName,
      type: 'Rename',
    };

    this.http.put('/api/inventory', newItem, options).subscribe((response) => {
      console.log(response);
    });

    this.getInventory();
  }
}
