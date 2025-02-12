import { Component, Input } from '@angular/core';
import { InventoryPageComponent } from '../inventory-page.component';
import { Router } from '@angular/router';

interface Container {
  LocID: number;
  Name: string;
  ParentID: number;
}

@Component({
    selector: 'app-inv-container',
    templateUrl: './inv-container.component.html',
    styleUrls: ['./inv-container.component.css'],
    standalone: false
})
export class InvContainerComponent {
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
    this.router.navigate(['/containers', this.container.LocID]);
  }

  renameContainer(index: number) {
    this.inventoryPage.openRenameDialog(index);
  }

  moveContainer(index: number) {
    this.inventoryPage.openMoveDialog(index);
  }
}
