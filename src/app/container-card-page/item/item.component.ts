import { Component, Input } from '@angular/core';
import { ContainerCardPageComponent } from '../container-card-page.component';
import { MatTooltip } from '@angular/material/tooltip';

interface Item {
  ItemID: number;
  User: string;
  ItemName: string;
  LocID: number;
  Count: number;
}

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.css'],
    standalone: false
})
export class ItemComponent {
  @Input() item: Item = {
    ItemID: -1,
    User: '',
    ItemName: '',
    LocID: -1,
    Count: -1,
  };

  @Input() index: number = -1;
  @Input() maxNameLength: number = 20; // Default value if not provided

  constructor(private ContainerCardPage: ContainerCardPageComponent) {}

  get truncatedName(): string {
    if (this.item.ItemName.length > this.maxNameLength) {
      return this.item.ItemName.substring(0, this.maxNameLength) + '...';
    }
    return this.item.ItemName;
  }
  
  deleteItem(index: number) {
    this.ContainerCardPage.openConfirmDialog(index, 'item');
  }

  renameItem(index: number) {
    this.ContainerCardPage.openRenameDialog(index, 'item');
  }

  incrementItem(index: number) {
    this.ContainerCardPage.incrementItemCount(index);
  }

  decrementItem(index: number) {
    this.ContainerCardPage.decrementItemCount(index);
  }

  updateCount(index: number) {
    this.ContainerCardPage.openRecountDialog(index);
  }

  moveContainer(index: number) {
    this.ContainerCardPage.openMoveDialog(index, 'item');
  }
}
