import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-rename-dialog',
  templateUrl: './rename-dialog.component.html',
  styleUrls: ['./rename-dialog.component.css']
})
export class RenameDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<RenameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string }
  ) {}

  cancel() {
    this.dialogRef.close();
  }

  rename() {
    this.dialogRef.close(this.data.name);
  }
}
