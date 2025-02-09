import { Component, Input } from '@angular/core';
import { InventoryPageComponent } from '../inventory-page.component';
import { Router } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';

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
  @Input() maxNameLength: number = 20; // Default value if not provided

  constructor(
    private inventoryPage: InventoryPageComponent,
    private router: Router
  ) {}

  get truncatedName(): string {
    if (this.container.Name.length > this.maxNameLength) {
      return this.container.Name.substring(0, this.maxNameLength) + '...';
    }
    return this.container.Name;
  }
  
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
