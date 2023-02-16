import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../inventory-page/dialog/dialog.component';
import { ConfirmDialogComponent } from '../inventory-page/confirm-dialog/confirm-dialog.component';
import { RenameDialogComponent } from '../inventory-page/rename-dialog/rename-dialog.component';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

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
  items: InvItem[] = [];

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef
  ) {}

  getInventory() {
    this.http
      .get<{ [key: string]: InvItem }>('/api/inventory')
      .subscribe((items) => {
        this.items = Object.values(items);
        this.cdRef.detectChanges();
      });
  }

  createItem(name: string) {
    const newItem = {
      name,
      location: 'top shelf',
      type: 'Add',
    };

    this.http.post('/api/inventory', newItem).subscribe((response) => {
      console.log(response);
    });

    this.getInventory();
  }

  ngOnInit() {
    this.getInventory();
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
    const itemName = {
      name: this.items[index].Name,
    };
    this.http
      .delete('/api/inventory', { body: itemName })
      .subscribe((response) => {
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
    const newItem = {
      name: this.items[index].Name,
      location: newName,
      type: 'Rename',
    };

    this.http.post('/api/inventory', newItem).subscribe((response) => {
      console.log(response);
    });

    this.getInventory();
  }
}
