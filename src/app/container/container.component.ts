import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { ContainerCardPageComponent } from '../container-card-page/container-card-page.component';
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
    private containerPage: ContainerCardPageComponent,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

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
}
