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
import { NotesDialogComponent } from './notes-dialog/notes-dialog.component'; // new
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


interface Item {
  ItemID: number;
  User: string;
  ItemName: string;
  LocID: number;
  Count: number;
  Notes: string; // new
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
  tileSize: number = 2.5;
  maxNameLength: number = 20;


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


  get combinedItems() {
    return [...this.containers, ...this.items];
  }

  logOut() {
    this.authService.logout();
  }


  private sortContainers() {
    this.containers.sort((a, b) =>
      a.Name.toLowerCase().localeCompare(b.Name.toLowerCase())
    );
  }


  private sortItems() {
    this.items.sort((a, b) =>
      a.ItemName.toLowerCase().localeCompare(b.ItemName.toLowerCase())
    );
  }


  getInventory() {
    const authToken: string = localStorage.getItem('token')!;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: authToken,
      }),
    };

    this.http
      .get<any>(`/api/containers?container_id=${this.containerId}`, httpOptions)
      .subscribe((response) => {
        this.containers = response as Container[];
        this.sortContainers();
        this.cdRef.detectChanges();
      });

    this.http
      .get<any>(`/api/items?container_id=${this.containerId}`, httpOptions)
      .subscribe((response) => {
        this.items = response as Item[];
        this.sortItems();
        this.cdRef.detectChanges();
      });
  }


  createContainer(newName: string) {
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


  onDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const item = event.previousContainer.data[event.previousIndex];
      const targetContainerId = event.container.id === 'sidenavList'
        ? this.containers[event.currentIndex]?.LocID
        : parseInt(event.container.id);
      if ('ItemID' in item) {
        this.moveItem(event.previousIndex - this.containers.length, targetContainerId);
      } else {
        this.moveContainer(event.previousIndex, targetContainerId);
      }
    }
  }


  updateGridCols() {
    const baseColumns = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 4;
    this.gridCols = Math.max(1, Math.floor(baseColumns * (2.5 / this.tileSize)));
  }

  updateMaxNameLength() {
    const baseLength = 20;
    this.maxNameLength = Math.floor(baseLength * (this.tileSize / 3));
    this.maxNameLength = Math.max(5, Math.min(80, this.maxNameLength));
  }


  increaseTileSize() {
    if (this.tileSize < 4) {
      this.tileSize += 0.5;
      this.updateGridCols();
      this.updateMaxNameLength();
    }
  }


  decreaseTileSize() {
    if (this.tileSize > 1.5) {
      this.tileSize -= 0.5;
      this.updateGridCols();
      this.updateMaxNameLength();
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
    const authToken: string = localStorage.getItem('token')!;
    const httpOptions = {
      headers: new HttpHeaders({ Authorization: authToken }),
    };
    this.http
      .get<string>(`/api/name?Container_id=${this.containerId}`, httpOptions)
      .subscribe((response) => {
        let arr = response.split('/');
        arr.shift();
        this.containerName = arr.join('/');
        this.cdRef.detectChanges();
      });
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: Object.entries({ name: '', description: '' }),
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.createContainer(result.name);
    });
  }


  openItemDialog(): void {
    const dialogRef = this.dialog.open(ItemDialogComponent, {
      data: Object.entries({ name: '', count: '' }),
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        result.forEach((item: any) => {
          this.createItem(item.name, item.count || 1);
        });
      }
    });
  }


  removeItem(index: number) {
    const authToken: string = localStorage.getItem('token')!;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: authToken,
      }),
      body: { token: authToken, type: 'item', id: this.items[index].ItemID },
    };
    this.http.delete('/api/inventory', httpOptions).subscribe((response) => {
      console.log(response);
      this.items.splice(index, 1);
      this.getInventory();
    });
  }


  openConfirmDialog(index: number, type: string) {
    const name = type === 'item' ? this.items[index].ItemName : this.containers[index].Name;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { name },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        type === 'item' ? this.removeItem(index) : this.removeContainer(index);
      }
    });
  }


  openRenameDialog(index: number, type: string) {
    const name = type === 'item' ? this.items[index].ItemName : this.containers[index].Name;
    const dialogRef = this.dialog.open(RenameDialogComponent, {
      width: '300px',
      data: { name },
    });
    dialogRef.afterClosed().subscribe((newName: string) => {
      if (newName) {
        type === 'item' ? this.renameItem(index, newName) : this.renameContainer(index, newName);
      }
    });
  }


  renameTopContainerDialog() {
    const dialogRef = this.dialog.open(RenameDialogComponent, {
      width: '300px',
      data: { name: this.containerName },
    });
    dialogRef.afterClosed().subscribe((newName: string) => {
      if (newName) this.renameTopContainer(newName);
    });
  }


  renameItem(index: number, newName: string) {
    const authToken: string = localStorage.getItem('token')!;
    const options = { headers: new HttpHeaders({ Authorization: 'Bearer ' + authToken }) };
    const newItem = {
      Authorization: authToken,
      name: newName,
      type: 'Rename',
      kind: 'Item',
      ID: this.items[index].ItemID,
      Cont: this.items[index].LocID,
    };
    this.http.put('/api/inventory', newItem, options).subscribe(() => this.getInventory());
  }


  renameContainer(index: number, newName: string) {
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
        Authorization: authToken,
      }),
    };
    this.http.put('/api/inventory', updateContainer, httpOptions).subscribe(() => this.getInventory());
  }


  renameTopContainer(newName: string) {
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
        Authorization: authToken,
      }),
    };
    this.http.put('/api/inventory', updateContainer, httpOptions).subscribe(() => {
      this.containerName = newName;
      this.getInventory();
    });
  }


  removeContainer(index: number) {
    const authToken: string = localStorage.getItem('token')!;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: authToken,
      }),
      body: { token: authToken, type: 'container', id: this.containers[index].LocID },
    };
    this.http.delete('/api/inventory', httpOptions).subscribe(() => {
      this.containers.splice(index, 1);
      this.getInventory();
    });
  }


  onSubmit() {
    this.router.navigate(['/search'], { queryParams: { q: this.query } });
  }


  incrementItemCount(index: number) {
    const authToken: string = localStorage.getItem('token')!;
    const options = { headers: new HttpHeaders({ Authorization: 'Bearer ' + authToken }) };
    const newItem = {
      Authorization: authToken,
      name: this.items[index].ItemName,
      type: 'Recount',
      kind: 'Item',
      ID: this.items[index].ItemID,
      Cont: this.items[index].LocID,
      Count: this.items[index].Count + 1,
    };
    this.http.put('/api/inventory', newItem, options).subscribe(() => this.getInventory());
  }


  decrementItemCount(index: number) {
    if (this.items[index].Count == 1) return;
    const authToken: string = localStorage.getItem('token')!;
    const options = { headers: new HttpHeaders({ Authorization: 'Bearer ' + authToken }) };
    const newItem = {
      Authorization: authToken,
      name: this.items[index].ItemName,
      type: 'Recount',
      kind: 'Item',
      ID: this.items[index].ItemID,
      Cont: this.items[index].LocID,
      Count: this.items[index].Count - 1,
    };
    this.http.put('/api/inventory', newItem, options).subscribe(() => this.getInventory());
  }


  updateItemCount(index: number, newCount: string) {
    const newerCount = Math.max(1, parseInt(newCount));
    const authToken: string = localStorage.getItem('token')!;
    const options = { headers: new HttpHeaders({ Authorization: 'Bearer ' + authToken }) };
    const newItem = {
      Authorization: authToken,
      name: this.items[index].ItemName,
      type: 'Recount',
      kind: 'Item',
      ID: this.items[index].ItemID,
      Cont: this.items[index].LocID,
      Count: newerCount,
    };
    this.http.put('/api/inventory', newItem, options).subscribe(() => this.getInventory());
  }


  openRecountDialog(index: number) {
    const dialogRef = this.dialog.open(RecountDialogComponent, {
      width: '300px',
      data: { count: this.items[index].Count },
    });
    dialogRef.afterClosed().subscribe((newCount: string) => {
      if (newCount) this.updateItemCount(index, newCount);
    });
  }


  // new — opens the notes dialog pre-populated with the item's current notes
  openNotesDialog(index: number) {
    const dialogRef = this.dialog.open(NotesDialogComponent, {
      width: '400px',
      data: { notes: this.items[index].Notes },
    });
    dialogRef.afterClosed().subscribe((newNotes: string) => {
      if (newNotes !== undefined) this.updateItemNotes(index, newNotes);
    });
  }


  // new — sends PUT /api/inventory with Type: "UpdateNotes"
  updateItemNotes(index: number, newNotes: string) {
    const authToken: string = localStorage.getItem('token')!;
    const options = { headers: new HttpHeaders({ Authorization: 'Bearer ' + authToken }) };
    const payload = {
      Authorization: authToken,
      Name: newNotes,
      Type: 'UpdateNotes',
      Kind: 'Item',
      ID: this.items[index].ItemID,
      Cont: this.items[index].LocID,
    };
    this.http.put('/api/inventory', payload, options).subscribe(() => this.getInventory());
  }


  openMoveDialog(index: number, type: string) {
    const name = type === 'container' ? this.containers[index].Name : this.items[index].ItemName;
    const dialogRef = this.dialog.open(MoveDialogComponent, {
      width: '300px',
      data: { name },
    });
    dialogRef.afterClosed().subscribe((parentID: number) => {
      if (parentID) {
        type === 'container' ? this.moveContainer(index, parentID) : this.moveItem(index, parentID);
      }
    });
  }


  moveContainer(index: number, parentID: number) {
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
        Authorization: authToken,
      }),
    };
    this.http.put('/api/inventory', updateContainer, httpOptions).subscribe(() => this.getInventory());
  }


  moveItem(index: number, parentID: number) {
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
        Authorization: authToken,
      }),
    };
    this.http.put('/api/inventory', updateItem, httpOptions).subscribe(() => this.getInventory());
  }
}
