import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Item } from '../../models'; // adjust path if your models file is elsewhere

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  standalone: false,
})
export class ItemComponent {
  @Input() item: Item = {
    ItemID: -1,
    User: '',
    ItemName: '',
    LocID: -1,
    Count: -1,
    Notes: '',
  };

  @Input() index: number = -1;
  @Input() maxNameLength: number = 20;

  @Output() delete = new EventEmitter<number>();
  @Output() rename = new EventEmitter<number>();
  @Output() increment = new EventEmitter<number>();
  @Output() decrement = new EventEmitter<number>();
  @Output() recount = new EventEmitter<number>();
  @Output() move = new EventEmitter<number>();
  @Output() editNotes = new EventEmitter<number>();

  get truncatedName(): string {
    if (this.item.ItemName.length > this.maxNameLength) {
      return this.item.ItemName.substring(0, this.maxNameLength) + '...';
    }
    return this.item.ItemName;
  }

  deleteItem() {
    this.delete.emit(this.index);
  }

  renameItem() {
    this.rename.emit(this.index);
  }

  incrementItem() {
    this.increment.emit(this.index);
  }

  decrementItem() {
    this.decrement.emit(this.index);
  }

  updateCount() {
    this.recount.emit(this.index);
  }

  moveItem() {
    this.move.emit(this.index);
  }

  editItemNotes() {
    this.editNotes.emit(this.index);
  }
}
