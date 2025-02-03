import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-delete-account-dialog',
    templateUrl: './delete-account-dialog.component.html',
    styleUrls: ['./delete-account-dialog.component.css'],
    standalone: false
})
export class DeleteAccountDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteAccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { password: string; confirmpass: string }
  ) {}

  cancel() {
    this.dialogRef.close();
  }

  deleteAccount() {
    this.dialogRef.close({
      password: this.data.password,
      confirmpass: this.data.confirmpass,
    });
  }
}
