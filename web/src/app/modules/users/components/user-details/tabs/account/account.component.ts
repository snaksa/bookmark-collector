import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../shared/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  accountFormGroup: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
  });

  constructor(private authService: AuthService) {}

  onSubmit() {
    console.log(this.accountFormGroup.value);
    this.authService
      .updateUser(
        this.accountFormGroup.value.firstName,
        this.accountFormGroup.value.lastName,
        this.accountFormGroup.value.email
      )
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
