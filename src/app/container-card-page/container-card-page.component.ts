import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../inventory-page/dialog/dialog.component';
import { ConfirmDialogComponent } from '../inventory-page/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-container-card-page',
  templateUrl: './container-card-page.component.html',
  styleUrls: ['./container-card-page.component.css']
})
export class ContainerCardPageComponent implements OnInit {
  containerId: number = -1;

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

  constructor(public dialog: MatDialog, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.containerId = +id;
    }
  }

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