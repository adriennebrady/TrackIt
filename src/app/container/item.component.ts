import { Component, Input } from '@angular/core';
import { ContainerCardPageComponent } from '../container-card-page/container-card-page.component';

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

  constructor(private ContainerCardPage: ContainerCardPageComponent) {}

  deleteItem(index: number) {
    this.ContainerCardPage.openConfirmDialog(index);
  }

  renameItem(index: number) {
    this.ContainerCardPage.openRenameDialog(index);
  }
}
