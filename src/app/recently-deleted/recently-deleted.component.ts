// recently-deleted.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { ConfirmDialogComponent } from '../inventory-page/confirm-dialog/confirm-dialog.component';
import { InventoryService } from '../inventory.service';
import { RecentlyDeletedItem } from '../models';

@Component({
  selector: 'app-recently-deleted',
  templateUrl: './recently-deleted.component.html',
  styleUrls: ['./recently-deleted.component.css'],
  standalone: false,
})
export class RecentlyDeletedComponent implements OnInit, OnDestroy {
  items: RecentlyDeletedItem[] = [];
  gridCols: number = 4;

  private boundUpdateGridCols = this.updateGridCols.bind(this);

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private inventoryService: InventoryService
  ) {}

  updateGridCols() {
    this.gridCols =
      window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 4;
  }

  ngOnInit() {
    this.getItems();
    this.updateGridCols();
    window.addEventListener('resize', this.boundUpdateGridCols);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.boundUpdateGridCols);
  }

  getItems() {
    this.inventoryService.getDeletedItems().subscribe((res) => {
      this.items = res;
    });
  }

  openConfirmDialog(index: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { name: this.items[index].DeletedItemName },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.removeItem(index);
    });
  }

  removeItem(index: number) {
    const authToken = localStorage.getItem('token')!;
    this.inventoryService.deleteDeletedItem({
      token: authToken,
      type: 'item',
      id: +this.items[index].ItemID,
    }).subscribe(() => {
      this.items.splice(index, 1);
      this.getItems();
    });
  }

  restoreItem(index: number) {
    const authToken = localStorage.getItem('token')!;
    this.inventoryService.createInventory({
      Authorization: authToken,
      Kind: 'item',
      Name: this.items[index].DeletedItemName,
      ID: this.items[index].ItemID,
      Type: 'Add',
      Cont: this.items[index].DeletedItemLocation,
      Count: this.items[index].DeletedItemCount,
    }).subscribe(() => this.removeItem(index));
  }

  logOut() {
    this.authService.logout();
  }
}
