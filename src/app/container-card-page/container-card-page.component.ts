import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-container-card-page',
  templateUrl: './container-card-page.component.html',
  styleUrls: ['./container-card-page.component.css']
})
export class ContainerCardPageComponent implements OnInit {
  items = [ 
    {
      name: 'Milk',
      description: "Expiration date: 1/13/2023"
    }, 
    { 
      name: 'Juice',
      description: "Expiration date: 2/13/2023"
    }, 
    {
      name: 'Soda',
      description: "Expiration date: 3/13/2023"
    }];

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {name: '', description: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.items.push({name: result.name, description: result.description});
      }
    });
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
  }

  openConfirmDialog(index: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { name: this.items[index].name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeItem(index);
      }
    });
  }
}