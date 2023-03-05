import { Component, Input } from '@angular/core';
import { InventoryPageComponent } from '../inventory-page/inventory-page.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent {
  @Input() container: {
    id: number, 
    name: string,
    description: string
  } = { id: -1, name: '', description: '' };

  @Input() index: number = -1;

  constructor(private inventoryPage: InventoryPageComponent, private router: Router) {}

  deleteContainer(index: number) {
    this.inventoryPage.openConfirmDialog(index);
  }

  seeInside(id: number) {
    this.router.navigate(['/containers', id]);
  }
}
