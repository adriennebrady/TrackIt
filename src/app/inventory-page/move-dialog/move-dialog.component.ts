import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-move-dialog',
    templateUrl: './move-dialog.component.html',
    styleUrls: ['./move-dialog.component.css'],
    standalone: false
})
export class MoveDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<MoveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { parentID: number; name: String }
  ) {}

  cancel() {
    this.dialogRef.close();
  }

  move() {
    this.dialogRef.close(this.data.parentID);
  }

  parentIDSelected(LocID: number) {
    this.data.parentID = LocID;
  }
}
