import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-notes-dialog',
  templateUrl: './notes-dialog.component.html',
  standalone: false
})
export class NotesDialogComponent {
  notes: string;

  constructor(
    public dialogRef: MatDialogRef<NotesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { notes: string }
  ) {
    this.notes = data.notes ?? '';
  }

  onSave(): void {
    this.dialogRef.close(this.notes);
  }

  onCancel(): void {
    this.dialogRef.close(undefined);
  }
}
