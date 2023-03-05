import { Component, Input } from '@angular/core';
import { InventoryPageComponent } from '../inventory-page/inventory-page.component';
import { Router } from '@angular/router';

interface Container {
  LocID: number;
  Name: string;
  ParentID: number;
}

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css'],
})
export class ContainerComponent {
  @Input() container: Container = { LocID: -1, Name: '', ParentID: -1 };

  @Input() index: number = -1;

  constructor(
    private inventoryPage: InventoryPageComponent,
    private router: Router
  ) {}

  deleteContainer(index: number) {
    this.inventoryPage.openConfirmDialog(index);
  }

  seeInside(id: number) {
    sessionStorage.setItem('containerName', this.container.Name);
    this.router.navigate(['/containers', id]);
  }

  renameContainer(index: number) {
    this.inventoryPage.openRenameDialog(index);
  }
}
