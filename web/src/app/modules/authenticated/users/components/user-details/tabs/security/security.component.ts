import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../../shared/services/auth.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
})
export class SecurityComponent {
  securityFormGroup: FormGroup = new FormGroup({
    oldPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
  });
  loading = false;

  constructor(private authService: AuthService) {}

  get oldPasswordControl() {
    return this.securityFormGroup.get('oldPassword')!;
  }

  get newPasswordControl() {
    return this.securityFormGroup.get('newPassword')!;
  }

  onSubmit() {
    if (!this.securityFormGroup.valid) {
      return;
    }

    this.loading = true;
    this.authService.changePassword(this.oldPasswordControl.value, this.newPasswordControl.value).subscribe({
      next: (data) => {
        // TODO: show success
        this.loading = false;
      },
      error: (error) => {
        // TODO: show error
        console.log('Error', error);
        this.loading = false;
      },
    });
  }
}
