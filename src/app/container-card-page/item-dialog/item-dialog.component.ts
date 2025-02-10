import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-item-dialog',
    templateUrl: './item-dialog.component.html',
    styleUrls: ['./item-dialog.component.css'],
    standalone: false
})
export class ItemDialogComponent implements OnInit {
  lastAddedItem: any = null;
  addedItems: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  onAddClick(): void {
    if (this.data.name) {
      const count = this.data.count || 1;
      const newItem = { 
        name: this.data.name, 
        count: count 
      };
      this.lastAddedItem = newItem;
      this.addedItems.push(newItem);
      // Reset input fields after adding
      this.data.name = '';
      this.data.count = '';
    }
  }

  onDoneClick(): void {
    // Return all added items when done
    this.dialogRef.close(this.lastAddedItem ? this.addedItems : null);
  }

  onKeyEnter(event: any): void {
    if (event.key === 'Enter') {
      this.onAddClick();
    }
  }
}