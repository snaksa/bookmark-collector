import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { DialogModule } from './components/dialog/dialog.module';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { NotificationService } from './services/notification.service';
import { NotificationComponent } from './components/notification/notification/notification.component';

@NgModule({
  declarations: [ConfirmationDialogComponent, NotificationComponent],
  imports: [CoreModule, CommonModule, ReactiveFormsModule, DialogModule],
  providers: [NotificationService],
  exports: [ReactiveFormsModule, DialogModule, ConfirmationDialogComponent],
})
export class SharedModule {}
