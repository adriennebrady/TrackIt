import { Component, Input } from '@angular/core';
import { ContainerCardPageComponent } from '../container-card-page/container-card-page.component';

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

  constructor(private ContainerCardPage: ContainerCardPageComponent) {}

  deleteContainer(index: number) {
    this.ContainerCardPage.openConfirmDialog(index);
  }
}
