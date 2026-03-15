import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../inventory-page/dialog/dialog.component';
import { ConfirmDialogComponent } from '../inventory-page/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { RenameDialogComponent } from '../inventory-page/rename-dialog/rename-dialog.component';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';
import { ItemDialogComponent } from './item-dialog/item-dialog.component';
import { RecountDialogComponent } from './recount-dialog/recount-dialog.component';
import { MoveDialogComponent } from '../inventory-page/move-dialog/move-dialog.component';
import { NotesDialogComponent } from './notes-dialog/notes-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { InventoryService } from '../inventory.service';
import { Item, Container } from '../models';

@Component({
  selector: 'app-container-card-page',
  templateUrl: './container-card-page.component.html',
  styleUrls: ['./container-card-page.component.css'],
  standalone: false,
})
export class ContainerCardPageComponent implements OnInit, OnDestroy {
  containerId: number = -1;
  items: Item[] = [];
  containers: Container[] = [];
  containerName: string = '';
  query: string = '';
  gridCols: number = 4;
  tileSize: number = 2.5;
  maxNameLength: number = 20;

  private boundUpdateGridCols = this.updateGridCols.bind(this);

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private inventoryService: InventoryService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {}

  // ── Getters ───────────────────────────────────────────────

  get combinedItems(): (Container | Item)[] {
    return [...this.containers, ...this.items];
  }

  // ── Navigation ────────────────────────────────────────────

  backClicked() {
    this.location.back();
  }

  logOut() {
    this.authService.logout();
  }

  onSubmit() {
    this.router.navigate(['/search'], { queryParams: { q: this.query } });
  }

  // ── Data fetching ─────────────────────────────────────────

  getInventory() {
    this.inventoryService.getContainers(this.containerId).subscribe((res) => {
      this.containers = res;
      this.sortContainers();
    });

    this.inventoryService.getItems(this.containerId).subscribe((res) => {
      this.items = res;
      this.sortItems();
    });
  }

  getContainerName() {
    this.inventoryService.getContainerName(this.containerId).subscribe((res) => {
      const arr = res.split('/');
      arr.shift();
      this.containerName = arr.join('/');
    });
  }

  // ── Sorting ───────────────────────────────────────────────

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

  // ── Create ────────────────────────────────────────────────

  createContainer(newName: string) {
    const authToken = localStorage.getItem('token')!;
    this.inventoryService.createInventory({
      Authorization: authToken,
      Kind: 'container',
      Name: newName,
      ID: Math.floor(Math.random() * 100000) + 28,
      Type: 'Add',
      Cont: +this.containerId,
      Count: -1,
    }).subscribe(() => this.getInventory());
  }

  createItem(newName: string, count: number) {
    const authToken = localStorage.getItem('token')!;
    this.inventoryService.createInventory({
      Authorization: authToken,
      Kind: 'item',
      Name: newName,
      ID: Math.floor(Math.random() * 100000) + 28,
      Type: 'Add',
      Cont: +this.containerId,
      Count: +count,
    }).subscribe(() => this.getInventory());
  }

  // ── Delete ────────────────────────────────────────────────

  removeItem(index: number) {
    const authToken = localStorage.getItem('token')!;
    this.inventoryService.deleteInventory({
      token: authToken,
      type: 'item',
      id: this.items[index].ItemID,
    }).subscribe(() => {
      this.items.splice(index, 1);
      this.getInventory();
    });
  }

  removeContainer(index: number) {
    const authToken = localStorage.getItem('token')!;
    this.inventoryService.deleteInventory({
      token: authToken,
      type: 'container',
      id: this.containers[index].LocID,
    }).subscribe(() => {
      this.containers.splice(index, 1);
      this.getInventory();
    });
  }

  // ── Rename ────────────────────────────────────────────────

  renameItem(index: number, newName: string) {
    const authToken = localStorage.getItem('token')!;
    this.inventoryService.updateInventory({
      Authorization: authToken,
      Kind: 'Item',
      Name: newName,
      Type: 'Rename',
      ID: this.items[index].ItemID,
      Cont: this.items[index].LocID,
    }).subscribe(() => this.getInventory());
  }

  renameContainer(index: number, newName: string) {
    const authToken = localStorage.getItem('token')!;
    this.inventoryService.updateInventory({
      Authorization: authToken,
      Kind: 'Container',
      ID: this.containers[index].LocID,
      Cont: this.containerId,
      Name: newName,
      Type: 'Rename',
    }).subscribe(() => this.getInventory());
  }

  renameTopContainer(newName: string) {
    const authToken = localStorage.getItem('token')!;
    this.inventoryService.updateInventory({
      Authorization: authToken,
      Kind: 'Container',
      ID: this.containerId,
      Cont: -1,
      Name: newName,
      Type: 'Rename',
    }).subscribe(() => {
      this.containerName = newName;
      this.getInventory();
    });
  }

  // ── Move ──────────────────────────────────────────────────

  moveItem(index: number, parentID: number) {
    const authToken = localStorage.getItem('token')!;
    this.inventoryService.updateInventory({
      Authorization: authToken,
      Kind: 'Item',
      ID: this.items[index].ItemID,
      Cont: parentID,
      Name: this.items[index].ItemName,
      Type: 'Relocate',
    }).subscribe(() => this.getInventory());
  }

  moveContainer(index: number, parentID: number) {
    const authToken = localStorage.getItem('token')!;
    this.inventoryService.updateInventory({
      Authorization: authToken,
      Kind: 'Container',
      ID: this.containers[index].LocID,
      Cont: parentID,
      Name: this.containers[index].Name,
      Type: 'Relocate',
    }).subscribe(() => this.getInventory());
  }

  // ── Count ─────────────────────────────────────────────────

  incrementItemCount(index: number) {
    const authToken = localStorage.getItem('token')!;
    this.inventoryService.updateInventory({
      Authorization: authToken,
      Kind: 'Item',
      Type: 'Recount',
      ID: this.items[index].ItemID,
      Cont: this.items[index].LocID,
      Name: this.items[index].ItemName,
      Count: this.items[index].Count + 1,
    }).subscribe(() => this.getInventory());
  }

  decrementItemCount(index: number) {
    if (this.items[index].Count === 1) return;
    const authToken = localStorage.getItem('token')!;
    this.inventoryService.updateInventory({
      Authorization: authToken,
      Kind: 'Item',
      Type: 'Recount',
      ID: this.items[index].ItemID,
      Cont: this.items[index].LocID,
      Name: this.items[index].ItemName,
      Count: this.items[index].Count - 1,
    }).subscribe(() => this.getInventory());
  }

  updateItemCount(index: number, newCount: string) {
    const authToken = localStorage.getItem('token')!;
    this.inventoryService.updateInventory({
      Authorization: authToken,
      Kind: 'Item',
      Type: 'Recount',
      ID: this.items[index].ItemID,
      Cont: this.items[index].LocID,
      Name: this.items[index].ItemName,
      Count: Math.max(1, parseInt(newCount)),
    }).subscribe(() => this.getInventory());
  }

  // ── Notes ─────────────────────────────────────────────────

  updateItemNotes(index: number, newNotes: string) {
    const authToken = localStorage.getItem('token')!;
    this.inventoryService.updateInventory({
      Authorization: authToken,
      Kind: 'Item',
      Type: 'UpdateNotes',
      Name: newNotes,
      ID: this.items[index].ItemID,
      Cont: this.items[index].LocID,
    }).subscribe(() => this.getInventory());
  }

  // ── Dialogs ───────────────────────────────────────────────

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { name: '', description: '' },
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

  openConfirmDialog(index: number, type: string) {
    const name =
      type === 'item'
        ? this.items[index].ItemName
        : this.containers[index].Name;
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
    const name =
      type === 'item'
        ? this.items[index].ItemName
        : this.containers[index].Name;
    const dialogRef = this.dialog.open(RenameDialogComponent, {
      width: '300px',
      data: { name },
    });
    dialogRef.afterClosed().subscribe((newName: string) => {
      if (newName) {
        type === 'item'
          ? this.renameItem(index, newName)
          : this.renameContainer(index, newName);
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

  openMoveDialog(index: number, type: string) {
    const name =
      type === 'container'
        ? this.containers[index].Name
        : this.items[index].ItemName;
    const dialogRef = this.dialog.open(MoveDialogComponent, {
      width: '300px',
      data: { name },
    });
    dialogRef.afterClosed().subscribe((parentID: number) => {
      if (parentID) {
        type === 'container'
          ? this.moveContainer(index, parentID)
          : this.moveItem(index, parentID);
      }
    });
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

  openNotesDialog(index: number) {
    const dialogRef = this.dialog.open(NotesDialogComponent, {
      width: '400px',
      data: { notes: this.items[index].Notes },
    });
    dialogRef.afterClosed().subscribe((newNotes: string) => {
      if (newNotes !== undefined) this.updateItemNotes(index, newNotes);
    });
  }

  // ── Grid helpers ──────────────────────────────────────────

  updateGridCols() {
    const base =
      window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 4;
    this.gridCols = Math.max(1, Math.floor(base * (2.5 / this.tileSize)));
  }

  updateMaxNameLength() {
    this.maxNameLength = Math.floor(20 * (this.tileSize / 3));
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

  // ── Drag and drop ─────────────────────────────────────────

  onDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const item = event.previousContainer.data[event.previousIndex];
      const targetContainerId =
        event.container.id === 'sidenavList'
          ? this.containers[event.currentIndex]?.LocID
          : parseInt(event.container.id);
      if ('ItemID' in item) {
        this.moveItem(
          event.previousIndex - this.containers.length,
          targetContainerId
        );
      } else {
        this.moveContainer(event.previousIndex, targetContainerId);
      }
    }
  }

  // ── Lifecycle ─────────────────────────────────────────────

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.containerId = parseInt(params['id']);
      this.getContainerName();
      this.getInventory();
      this.updateGridCols();
      window.addEventListener('resize', this.boundUpdateGridCols);
    });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.boundUpdateGridCols);
  }
}
