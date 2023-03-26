import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../inventory-page/dialog/dialog.component';
import { ConfirmDialogComponent } from '../inventory-page/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RenameDialogComponent } from '../inventory-page/rename-dialog/rename-dialog.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';
import { ItemDialogComponent } from '../inventory-page/item-dialog/item-dialog.component';
import { NavigationEnd } from '@angular/router';

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
  query: string = '';

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
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
      .get<any>(`/api/inventory?container_id=${this.containerId}`, httpOptions)
      .subscribe((response) => {
        if (response != null) {
          const result = response.reduce(
            (acc: { containers: Container[]; items: Item[] }, item: any) => {
              if (item.ParentID) {
                acc.containers.push(item);
              } else if (item.ItemID) {
                acc.items.push(item);
              }
              return acc;
            },
            { containers: [], items: [] }
          );

          this.containers = result.containers;
          this.items = result.items;
        } else {
          this.containers = [];
          this.items = [];
        }
      });
  }

  createContainer(newName: string) {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;

    const newContainer = {
      Authorization: authToken,
      Kind: 'container',
      Name: newName,
      ID: Math.floor(Math.random() * 100000) + 28,
      Type: 'Add',
      Cont: +this.containerId,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: newContainer.Authorization,
      }),
    };

    this.http
      .post('/api/inventory', newContainer, httpOptions)
      .subscribe((response) => {
        console.log(response);
        this.getInventory();
      });
  }

  createItem(newName: string, count: number) {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;

    const newItem = {
      Authorization: authToken,
      Kind: 'item',
      Name: newName,
      ID: Math.floor(Math.random() * 100000) + 28,
      Type: 'Add',
      Cont: +this.containerId,
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
    this.route.params.subscribe((params) => {
      this.containerId = params['id'];
      this.getContainerName();
      this.getInventory();
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.cdRef.detectChanges();
      }
    });
  }

  getContainerName() {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: authToken,
      }),
    };

    this.http
      .get<string>(`/api/name?Container_id=${this.containerId}`, httpOptions)
      .subscribe((response) => {
        this.containerName = response;
        this.cdRef.detectChanges();
      });
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

  openConfirmDialog(index: number, type: string) {
    if (type == 'item') {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '250px',
        data: { name: this.items[index].ItemName },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.removeItem(index);
        }
      });
    } else if (type == 'container') {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '250px',
        data: { name: this.containers[index].Name },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.removeContainer(index);
        }
      });
    }
  }

  openRenameDialog(index: number, type: string) {
    if (type == 'item') {
      const dialogRef = this.dialog.open(RenameDialogComponent, {
        width: '300px',
        data: { name: this.items[index].ItemName },
      });

      dialogRef.afterClosed().subscribe((newName: string) => {
        if (newName) {
          this.renameItem(index, newName);
        }
      });
    } else if (type == 'container') {
      const dialogRef = this.dialog.open(RenameDialogComponent, {
        width: '300px',
        data: { name: this.containers[index].Name },
      });

      dialogRef.afterClosed().subscribe((newName: string) => {
        if (newName) {
          this.renameContainer(index, newName);
        }
      });
    }
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

  renameContainer(index: number, newName: string) {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;
    const rootLoc: string = localStorage.getItem('rootloc')!;

    const updateContainer = {
      Authorization: authToken,
      Kind: 'Container',
      ID: this.containers[index].LocID,
      Cont: parseInt(rootLoc),
      Name: newName,
      Type: 'Rename',
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: updateContainer.Authorization,
      }),
    };

    this.http
      .put('/api/inventory', updateContainer, httpOptions)
      .subscribe((response) => {
        console.log(response);
        this.getInventory();
      });
  }

  removeContainer(index: number) {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;

    const authorization = {
      Authorization: authToken,
    };

    const containerName = {
      token: authToken,
      type: 'container',
      id: this.containers[index].LocID,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: authorization.Authorization,
      }),
      body: containerName,
    };

    this.http.delete('/api/inventory', httpOptions).subscribe((response) => {
      console.log(response);
      this.containers.splice(index, 1);
    });

    this.getInventory();
  }

  onSubmit() {
    this.router.navigate(['/search'], { queryParams: { q: this.query } });
  }
}
