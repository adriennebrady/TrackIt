import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Container } from '../../models'; // adjust path to your shared models
import { Router } from '@angular/router';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css'],
  standalone: false,
})
export class ContainerComponent {
  @Input() container: Container = { LocID: -1, Name: '', ParentID: -1 };
  @Input() index: number = -1;
  @Input() maxNameLength: number = 20;

  @Output() delete = new EventEmitter<number>();
  @Output() rename = new EventEmitter<number>();
  @Output() move = new EventEmitter<number>();

  constructor(private router: Router) {}

  get truncatedName(): string {
    if (this.container.Name.length > this.maxNameLength) {
      return this.container.Name.substring(0, this.maxNameLength) + '...';
    }
    return this.container.Name;
  }

  deleteContainer() {
    this.delete.emit(this.index);
  }

  seeInside() {
    sessionStorage.setItem('containerName', this.container.Name);
    this.router.navigate(['/containers', this.container.LocID]);
  }

  renameContainer() {
    this.rename.emit(this.index);
  }

  moveContainer() {
    this.move.emit(this.index);
  }
}
