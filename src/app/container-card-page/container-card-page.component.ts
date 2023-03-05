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
import { ItemDialogComponent } from '../inventory-page/item-dialog/item-dialog.component';

interface Item {
  ItemID: number;
  User: string;
  ItemName: string;
  LocID: number;
  Count: number;
}

interface Container {
  LocID: number;
  Name: string;
  ParentID: number;
}

@Component({
  selector: 'app-container-card-page',
  templateUrl: './container-card-page.component.html',
  styleUrls: ['./container-card-page.component.css'],
})
export class ContainerCardPageComponent implements OnInit {
  containerId: number = -1;
  items: Item[] = [];
  containers: Container[] = [];
  containerName: string = '';

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
      .get<any>(`/api/inventory?Container_id=${this.containerId}`, httpOptions)
      .subscribe((response) => {
        this.containers = response.filter(
          (item: any) => 'ParentID' in item
        ) as Container[];

        this.items = response.filter(
          (item: any) => 'ItemName' in item
        ) as Item[];
        this.cdRef.detectChanges();
        console.log(this.containers);
      });
  }

  createContainer(newName: string) {}

  createItem(newName: string, count: number) {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;

    const newItem = {
      Authorization: authToken,
      Kind: 'item',
      Name: newName,
      ID: Math.floor(Math.random() * 100000) + 28,
      Type: 'Add',
      Cont: this.containerId,
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
        this.getInventory();
      });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.containerId = +id;
    }

    const name = sessionStorage.getItem('containerName');
    if (name) {
      this.containerName = name;
      sessionStorage.removeItem('containerName');
    }

    this.getInventory();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: Object.entries({ name: '', description: '' }),
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createContainer(result.name);
      }
    });
  }

  openItemDialog(): void {
    const dialogRef = this.dialog.open(ItemDialogComponent, {
      data: Object.entries({ name: '', count: '' }),
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createItem(result.name, result.count);
      }
    });
  }

  removeItem(index: number) {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;

    const authorization = {
      Authorization: authToken,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: authorization.Authorization,
        id: this.items[index].ItemID.toString(),
      }),
    };

    this.http.delete('/api/inventory', httpOptions).subscribe((response) => {
      console.log(response);
      this.items.splice(index, 1);
      this.getInventory();
    });
  }

  openConfirmDialog(index: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { name: this.items[index].ItemName },
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
      data: { name: this.items[index].ItemName },
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
      name: this.items[index].ItemName,
      location: newName,
      type: 'Rename',
    };

    this.http.put('/api/inventory', newItem, options).subscribe((response) => {
      console.log(response);
    });

    this.getInventory();
  }
}
