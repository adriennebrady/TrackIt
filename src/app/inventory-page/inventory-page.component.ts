import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.css'],
})
export class InventoryPageComponent implements OnInit {
  containers = [
    {
      name: 'Fridge',
      description: 'All my food is kept in here.',
    },
    {
      name: 'Workbench',
      description: 'All my tools are kept in here.',
    },
    {
      name: 'Dresser',
      description: 'All my clothes are kept in here.',
    },
  ];

  constructor(public dialog: MatDialog, private authService: AuthService) {}

  ngOnInit() {}

  logOut() {
    this.authService.logout();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { name: '', description: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.containers.push({
          name: result.name,
          description: result.description,
        });
      }
    });
  }

  removeContainer(index: number) {
    this.containers.splice(index, 1);
  }

  openConfirmDialog(index: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { name: this.containers[index].name },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.removeContainer(index);
      }
    });
  }
}
