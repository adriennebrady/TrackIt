// inventory-page.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AuthService } from '../auth.service';
import { RenameDialogComponent } from './rename-dialog/rename-dialog.component';
import { Router } from '@angular/router';
import { MoveDialogComponent } from './move-dialog/move-dialog.component';
import { InventoryService } from '../inventory.service';
import { Container } from '../models';

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.css'],
  standalone: false,
})
export class InventoryPageComponent implements OnInit, OnDestroy {
  containers: Container[] = [];
  query: string = '';
  gridCols: number = 4;
  tileSize: number = 2.5;
  maxNameLength: number = 20;

  private boundUpdateGridCols = this.updateGridCols.bind(this);

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private inventoryService: InventoryService,
    private router: Router
  ) {}

  getInventory() {
    const rootLoc = parseInt(localStorage.getItem('rootloc')!);
    this.inventoryService.getContainers(rootLoc).subscribe((res) => {
      this.containers = res;
    });
  }

  createContainer(newName: string) {
    const authToken = localStorage.getItem('token')!;
    const rootLoc = parseInt(localStorage.getItem('rootloc')!);
    this.inventoryService.createInventory({
      Authorization: authToken,
      Kind: 'container',
      ID: Math.floor(Math.random() * 100000) + 28,
      Cont: rootLoc,
      Name: newName,
      Type: 'Add',
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

  renameContainer(index: number, newName: string) {
    const authToken = localStorage.getItem('token')!;
    const rootLoc = parseInt(localStorage.getItem('rootloc')!);
    this.inventoryService.updateInventory({
      Authorization: authToken,
      Kind: 'Container',
      ID: this.containers[index].LocID,
      Cont: rootLoc,
      Name: newName,
      Type: 'Rename',
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

  openMoveDialog(index: number) {
    const dialogRef = this.dialog.open(MoveDialogComponent, {
      width: '300px',
      data: { name: this.containers[index].Name },
    });
    dialogRef.afterClosed().subscribe((parentID: number) => {
      if (parentID) this.moveContainer(index, parentID);
    });
  }

  openConfirmDialog(index: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { name: this.containers[index].Name },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.removeContainer(index);
    });
  }

  openRenameDialog(index: number) {
    const dialogRef = this.dialog.open(RenameDialogComponent, {
      width: '300px',
      data: { name: this.containers[index].Name },
    });
    dialogRef.afterClosed().subscribe((newName: string) => {
      if (newName) this.renameContainer(index, newName);
    });
  }

  // ── Grid helpers ─────────────────────────────────────────

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

  // ── Lifecycle ─────────────────────────────────────────────

  ngOnInit() {
    this.getInventory();
    this.updateGridCols();
    window.addEventListener('resize', this.boundUpdateGridCols);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.boundUpdateGridCols);
  }

  logOut() {
    this.authService.logout();
  }

  onSubmit() {
    this.router.navigate(['/search'], { queryParams: { q: this.query } });
  }
}
