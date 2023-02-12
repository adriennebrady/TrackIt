import { Component, Input } from '@angular/core';
import { InventoryPageComponent } from '../inventory-page/inventory-page.component';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent {
  @Input() container: {
    name: string,
    description: string
  } = { name: '', description: '' };

  @Input() index: number = -1;

  constructor(private inventoryPage: InventoryPageComponent) {}

  deleteContainer(index: number) {
    this.inventoryPage.openConfirmDialog(index);
  }
}
