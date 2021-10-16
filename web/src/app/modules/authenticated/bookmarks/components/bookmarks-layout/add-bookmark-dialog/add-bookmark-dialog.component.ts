import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-bookmark-dialog',
  templateUrl: './add-bookmark-dialog.component.html',
  styleUrls: ['./add-bookmark-dialog.component.scss'],
})
export class AddBookmarkDialogComponent {
  inputControl = new FormControl();

  constructor(private dialogRef: MatDialogRef<AddBookmarkDialogComponent>) {}

  add() {
    const url = this.inputControl.value;
    if (url) {
      this.dialogRef.close(url);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
