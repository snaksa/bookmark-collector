import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-label-dialog',
  templateUrl: './edit-label-dialog.component.html',
  styleUrls: ['./edit-label-dialog.component.scss'],
})
export class EditLabelDialogComponent {
  inputControl = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<EditLabelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }
  ) {
    this.inputControl.setValue(data.title);
  }

  onSubmit() {
    const value = this.inputControl.value;
    if (value) {
      this.dialogRef.close(value);
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
