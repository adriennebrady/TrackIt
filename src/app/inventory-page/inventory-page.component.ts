import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.css']
})
export class InventoryPageComponent implements OnInit {
  containers = [ 
    {
      name: 'Fridge',
      description: "All my food is kept in here."
    }, 
    { 
      name: 'Workbench',
      description: "All my tools are kept in here."
    }, 
    {
      name: 'Dresser',
      description: "All my clothes are kept in here."
    }];

    constructor(public dialog: MatDialog) {}

    ngOnInit() {}

    openDialog(): void {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {name: '', description: ''}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.containers.push({name: result.name, description: result.description});
        }
      });
    }
}
