import { Component, Input } from '@angular/core';
import { RecentlyDeletedComponent } from '../recently-deleted.component';
import { Time } from '@angular/common';

interface Item {
  ItemID: number;
  AccountID: string;
  DeletedItemName: string;
  DeletedItemLocation: number;
  DeletedItemCount: number;
  TimeStamp: String;
}

@Component({
  selector: 'app-deleted-item',
  templateUrl: './deleted-item.component.html',
  styleUrls: ['./deleted-item.component.css'],
})
export class DeletedItemComponent {
  @Input() item: Item = {
    ItemID: -1,
    AccountID: '',
    DeletedItemName: '',
    DeletedItemLocation: -1,
    DeletedItemCount: -1,
    TimeStamp: '',
  };

  @Input() index: number = -1;

  constructor(private recentlyDeletedPage: RecentlyDeletedComponent) {}

  deleteItem(index: number) {
    this.recentlyDeletedPage.openConfirmDialog(index);
  }

  restoreItem(index: number) {
    this.recentlyDeletedPage.restoreItem(index);
  }
}
