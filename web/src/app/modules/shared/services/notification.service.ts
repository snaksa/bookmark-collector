import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../components/notification/notification/notification.component';

export interface NotificationMessage {
  message: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBarService: MatSnackBar) {}

  success(message: NotificationMessage) {
    this.snackBarService.openFromComponent(NotificationComponent, {
      duration: 5000,
      panelClass: 'wrapper-success',
      data: message,
    });
  }
}
