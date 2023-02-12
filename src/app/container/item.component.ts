import { Component, Input } from '@angular/core';
import { ContainerCardPageComponent } from '../container-card-page/container-card-page.component';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent {
  @Input() item: {
    Name: string,
    Location: string
  } = { Name: '', Location: '' };

  @Input() index: number = -1;

  constructor(private ContainerCardPage: ContainerCardPageComponent) {}

  deleteItem(index: number) {
    this.ContainerCardPage.openConfirmDialog(index);
  }
}
