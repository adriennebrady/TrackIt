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
import { ItemDialogComponent } from './item-dialog/item-dialog.component';
import { NavigationEnd } from '@angular/router';
import { RecountDialogComponent } from './recount-dialog/recount-dialog.component';
import { MoveDialogComponent } from '../inventory-page/move-dialog/move-dialog.component';

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
    standalone: false
})
export class ContainerCardPageComponent implements OnInit {
  containerId: number = -1;
  items: Item[] = [];
  containers: Container[] = [];
  containerName: string = '';
  query: string = '';
  gridCols: number = 4;
  tileSize: number = 2.5; // Default tile size ratio
  maxNameLength: number = 20; // Default value

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

  // New method to sort containers alphabetically
  private sortContainers() {
    this.containers.sort((a, b) => 
      a.Name.toLowerCase().localeCompare(b.Name.toLowerCase())
    );
  }

  // New method to sort items alphabetically
  private sortItems() {
    this.items.sort((a, b) => 
      a.ItemName.toLowerCase().localeCompare(b.ItemName.toLowerCase())
    );
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
      .get<any>(`/api/containers?container_id=${this.containerId}`, httpOptions)
      .subscribe((response) => {
        this.containers = response as Container[];
        this.sortContainers(); // Sort containers after receiving them
        this.cdRef.detectChanges();
      });

    this.http
      .get<any>(`/api/items?container_id=${this.containerId}`, httpOptions)
      .subscribe((response) => {
        this.items = response as Item[];
        this.sortItems(); // Sort items after receiving them
        this.cdRef.detectChanges();
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
      Count: -1,
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
      Count: +count,
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

  updateGridCols() {
    const baseColumns = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 4;
    // Adjust columns based on tile size
    this.gridCols = Math.max(1, Math.floor(baseColumns * (2.5 / this.tileSize)));
  }
  updateMaxNameLength() {
    // Calculate based on tile size - as tiles get smaller, names should be shorter
    const baseLength = 20; // Base character length at default tile size (2.5)
    this.maxNameLength = Math.floor(baseLength * (this.tileSize / 3));
    // Ensure we have reasonable minimum and maximum values
    this.maxNameLength = Math.max(5, Math.min(80, this.maxNameLength));
  }

  increaseTileSize() {
    if (this.tileSize < 4) { // Maximum size limit
      this.tileSize += 0.5;
      this.updateGridCols();
      this.updateMaxNameLength(); // Update name length when tile size changes
    }
  }

  decreaseTileSize() {
    if (this.tileSize > 1.5) { // Minimum size limit
      this.tileSize -= 0.5;
      this.updateGridCols();
      this.updateMaxNameLength(); // Update name length when tile size changes
    }
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.containerId = parseInt(params['id']);
      this.getContainerName();
      this.getInventory();
      this.updateGridCols();
      window.addEventListener('resize', this.updateGridCols.bind(this));
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
        let arr;
        arr = response.split('/');
        arr.shift();
        response = arr.join('/');
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
        // Handle multiple items that were added
        result.forEach((item: any) => {
          this.createItem(item.name, item.count || 1);
        });
      }
    });
  }

  removeItem(index: number) {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;

    const authorization = {
      token: authToken,
      type: 'item',
      id: this.items[index].ItemID,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: authorization.token,
      }),
      body: authorization,
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

  renameTopContainerDialog() {
    const dialogRef = this.dialog.open(RenameDialogComponent, {
      width: '300px',
      data: { name: this.containerName },
    });

    dialogRef.afterClosed().subscribe((newName: string) => {
      if (newName) {
        this.renameTopContainer(newName);
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
      Authorization: authToken,
      name: newName,
      type: 'Rename',
      kind: 'Item',
      ID: this.items[index].ItemID,
      Cont: this.items[index].LocID,
    };

    this.http.put('/api/inventory', newItem, options).subscribe((response) => {
      console.log(response);
      this.getInventory();
    });
  }

  renameContainer(index: number, newName: string) {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;

    const updateContainer = {
      Authorization: authToken,
      Kind: 'Container',
      ID: this.containers[index].LocID,
      Cont: this.containerId,
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

  renameTopContainer(newName: string) {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;

    const updateContainer = {
      Authorization: authToken,
      Kind: 'Container',
      ID: this.containerId,
      Cont: -1,
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
        this.containerName = newName;
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

  incrementItemCount(index: number) {
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
      Authorization: authToken,
      name: this.items[index].ItemName,
      type: 'Recount',
      kind: 'Item',
      ID: this.items[index].ItemID,
      Cont: this.items[index].LocID,
      Count: this.items[index].Count + 1,
    };

    this.http.put('/api/inventory', newItem, options).subscribe((response) => {
      console.log(response);
      this.getInventory();
    });
  }

  decrementItemCount(index: number) {
    // first check if decrementing will make count < 1, if so, ignore
    if (this.items[index].Count == 1) {
      return;
    }

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
      Authorization: authToken,
      name: this.items[index].ItemName,
      type: 'Recount',
      kind: 'Item',
      ID: this.items[index].ItemID,
      Cont: this.items[index].LocID,
      Count: this.items[index].Count - 1,
    };

    this.http.put('/api/inventory', newItem, options).subscribe((response) => {
      console.log(response);
      this.getInventory();
    });
  }

  updateItemCount(index: number, newCount: string) {
    const newerCount = Math.max(1, parseInt(newCount))
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
      Authorization: authToken,
      name: this.items[index].ItemName,
      type: 'Recount',
      kind: 'Item',
      ID: this.items[index].ItemID,
      Cont: this.items[index].LocID,
      Count: newerCount,
    };

    this.http.put('/api/inventory', newItem, options).subscribe((response) => {
      console.log(response);
      this.getInventory();
    });
  }

  openRecountDialog(index: number) {
    const dialogRef = this.dialog.open(RecountDialogComponent, {
      width: '300px',
      data: { count: this.items[index].Count },
    });

    dialogRef.afterClosed().subscribe((newCount: string) => {
      if (newCount) {
        this.updateItemCount(index, newCount);
      }
    });
  }

  openMoveDialog(index: number, type: string) {
    if (type == 'container') {
      const dialogRef = this.dialog.open(MoveDialogComponent, {
        width: '300px',
        data: { name: this.containers[index].Name },
      });

      dialogRef.afterClosed().subscribe((parentID: number) => {
        if (parentID) {
          this.moveContainer(index, parentID);
        }
      });
    } else if (type == 'item') {
      const dialogRef = this.dialog.open(MoveDialogComponent, {
        width: '300px',
        data: { name: this.items[index].ItemName },
      });

      dialogRef.afterClosed().subscribe((parentID: number) => {
        if (parentID) {
          this.moveItem(index, parentID);
        }
      });
    }
  }

  moveContainer(index: number, parentID: number) {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;

    const updateContainer = {
      Authorization: authToken,
      Kind: 'Container',
      ID: this.containers[index].LocID,
      Cont: parentID,
      Name: this.containers[index].Name,
      Type: 'Relocate',
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

  moveItem(index: number, parentID: number) {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;

    const updateItem = {
      Authorization: authToken,
      Kind: 'Item',
      ID: this.items[index].ItemID,
      Cont: parentID,
      Name: this.items[index].ItemName,
      Type: 'Relocate',
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: updateItem.Authorization,
      }),
    };

    this.http
      .put('/api/inventory', updateItem, httpOptions)
      .subscribe((response) => {
        console.log(response);
        this.getInventory();
      });
  }
}
