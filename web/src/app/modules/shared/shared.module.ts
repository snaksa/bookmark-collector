import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { DialogModule } from './components/dialog/dialog.module';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [ConfirmationDialogComponent],
  imports: [CommonModule, ReactiveFormsModule, CoreModule, DialogModule],
  exports: [ReactiveFormsModule, DialogModule, ConfirmationDialogComponent],
})
export class SharedModule {}
