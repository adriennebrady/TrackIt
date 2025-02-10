import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { ContainerCardPageComponent } from '../container-card-page.component';
import { Router } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';

interface Container {
  LocID: number;
  Name: string;
  ParentID: number;
}

@Component({
    selector: 'app-container',
    templateUrl: './container.component.html',
    styleUrls: ['./container.component.css'],
    standalone: false
})
export class ContainerComponent {
  @Input() container: Container = { LocID: -1, Name: '', ParentID: -1 };

  @Input() index: number = -1;
  @Input() maxNameLength: number = 20; // Default value if not provided

  constructor(
    private containerPage: ContainerCardPageComponent,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  get truncatedName(): string {
    if (this.container.Name.length > this.maxNameLength) {
      return this.container.Name.substring(0, this.maxNameLength) + '...';
    }
    return this.container.Name;
  }

  deleteContainer(index: number) {
    this.containerPage.openConfirmDialog(index, 'container');
  }

  seeInside(id: number) {
    sessionStorage.setItem('containerName', this.container.Name);
    this.router.navigate(['/containers', this.container.LocID]);
    this.cd.detectChanges();
  }

  renameContainer(index: number) {
    this.containerPage.openRenameDialog(index, 'container');
  }

  moveContainer(index: number) {
    this.containerPage.openMoveDialog(index, 'container');
  }
}
