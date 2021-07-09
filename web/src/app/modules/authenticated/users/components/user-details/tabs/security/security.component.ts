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

  constructor(private authService: AuthService) {}

  onSubmit() {
    console.log(this.securityFormGroup.value);
    this.authService
      .changePassword(this.securityFormGroup.value.oldPassword, this.securityFormGroup.value.newPassword)
      .subscribe({
        next: (data) => {
          console.log('response', data);
        },
        error: (error) => {
          // TODO: show error
          console.log('Error', error);
        },
      });
  }
}
