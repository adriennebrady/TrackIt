import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { ConfirmDialogComponent } from '../inventory-page/confirm-dialog/confirm-dialog.component';
import { Time } from '@angular/common';

interface Item {
  ItemID: number;
  AccountID: string;
  DeletedItemName: string;
  DeletedItemLocation: number;
  DeletedItemCount: number;
  TimeStamp: String;
}

@Component({
    selector: 'app-recently-deleted',
    templateUrl: './recently-deleted.component.html',
    styleUrls: ['./recently-deleted.component.css'],
    standalone: false
})
export class RecentlyDeletedComponent implements OnInit {
  items: Item[] = [];

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getItems();
  }

  getItems() {
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

    this.http.get<Item[]>('/api/deleted', httpOptions).subscribe((response) => {
      this.items = response as Item[];
      console.log(this.items);
    });
  }

  openConfirmDialog(index: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { name: this.items[index].DeletedItemName },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.removeItem(index);
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
      token: authToken,
      type: 'item',
      id: +this.items[index].ItemID,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: authorization.Authorization,
      }),
      body: itemName,
    };

    this.http.delete('/api/deleted', httpOptions).subscribe((response) => {
      this.items.splice(index, 1);
      this.getItems();
    });
  }

  restoreItem(index: number) {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;

    const newItem = {
      Authorization: authToken,
      Kind: 'item',
      Name: this.items[index].DeletedItemName,
      ID: this.items[index].ItemID,
      Type: 'Add',
      Cont: this.items[index].DeletedItemLocation,
      Count: this.items[index].DeletedItemCount,
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
        this.removeItem(index);
      });
  }

  logOut() {
    this.authService.logout();
  }
}
