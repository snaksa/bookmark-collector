import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../shared/services/auth.service';
import { User } from '../../../../../shared/models/user.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  accountFormGroup: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
  });

  @Input() currentUser: User = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.accountFormGroup.controls['firstName'].setValue(this.currentUser.firstName);
    this.accountFormGroup.controls['lastName'].setValue(this.currentUser.lastName);
    this.accountFormGroup.controls['email'].setValue(this.currentUser.email);
  }

  onSubmit() {
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
