import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-recount-dialog',
    templateUrl: './recount-dialog.component.html',
    styleUrls: ['./recount-dialog.component.css'],
    standalone: false
})
export class RecountDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<RecountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { count: string }
  ) {}

  cancel() {
    this.dialogRef.close();
  }

  updateCount() {
    this.dialogRef.close(this.data.count);
  }
}
