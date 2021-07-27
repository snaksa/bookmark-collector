import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { User } from '../../../../../../shared/models/user.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  accountFormGroup: FormGroup = new FormGroup(
    {
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
    },
    {
      updateOn: 'submit',
    }
  );

  @Input() currentUser: User = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
  };

  @Input() updating = false;
  @Input() error = '';
  @Output() updateUser = new EventEmitter<{ firstName: string; lastName: string; email: string }>();

  get firstNameControl() {
    return this.accountFormGroup.get('firstName')!;
  }

  get lastNameControl() {
    return this.accountFormGroup.get('lastName')!;
  }

  get emailControl() {
    return this.accountFormGroup.get('email')!;
  }

  ngOnInit() {
    this.accountFormGroup.controls['firstName'].setValue(this.currentUser.firstName);
    this.accountFormGroup.controls['lastName'].setValue(this.currentUser.lastName);
    this.accountFormGroup.controls['email'].setValue(this.currentUser.email);
  }

  onSubmit() {
    if (!this.accountFormGroup.valid) {
      return;
    }

    this.updateUser.emit({
      firstName: this.accountFormGroup.value.firstName,
      lastName: this.accountFormGroup.value.lastName,
      email: this.accountFormGroup.value.email,
    });
  }
}
