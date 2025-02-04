import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RenameDialogComponent } from './rename-dialog/rename-dialog.component';
import { Router } from '@angular/router';
import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';
import { MoveDialogComponent } from './move-dialog/move-dialog.component';

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
    selector: 'app-inventory-page',
    templateUrl: './inventory-page.component.html',
    styleUrls: ['./inventory-page.component.css'],
    standalone: false
})
export class InventoryPageComponent implements OnInit {
  containers: Container[] = [];
  query: string = '';

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {}

  getInventory() {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;
    const rootLoc: string = localStorage.getItem('rootloc')!;

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
      .get<any>('/api/containers?container_id=' + rootLoc, httpOptions)
      .subscribe((response) => {
        this.containers = response as Container[];
        this.cdRef.detectChanges();
        console.log(this.containers);
      });
  }

  createContainer(newName: string) {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;
    const rootLoc: string = localStorage.getItem('rootloc')!;

    const newContainer = {
      Authorization: authToken,
      Kind: 'container',
      ID: Math.floor(Math.random() * 100000) + 28,
      Cont: parseInt(rootLoc),
      Name: newName,
      Type: 'Add',
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
  gridCols: number = 4;

  updateGridCols() {
    this.gridCols = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 4;
  }

  ngOnInit() {
    this.getInventory();
    this.updateGridCols();
    window.addEventListener('resize', this.updateGridCols.bind(this));
  }

  logOut() {
    this.authService.logout();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { name: '', description: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createContainer(result.name);
      }
    });
  }

  openMoveDialog(index: number) {
    const dialogRef = this.dialog.open(MoveDialogComponent, {
      width: '300px',
      data: { name: this.containers[index].Name },
    });

    dialogRef.afterClosed().subscribe((parentID: number) => {
      if (parentID) {
        this.moveContainer(index, parentID);
      }
    });
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
      this.getInventory();
    });
  }

  openConfirmDialog(index: number) {
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

  openRenameDialog(index: number) {
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

  onSubmit() {
    this.router.navigate(['/search'], { queryParams: { q: this.query } });
  }
}
