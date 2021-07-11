import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerFormGroup: FormGroup = new FormGroup({
    email: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    password: new FormControl(''),
  });

  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    if (
      !this.registerFormGroup.controls['email'].value ||
      !this.registerFormGroup.controls['password'].value ||
      !this.registerFormGroup.controls['firstName'].value ||
      !this.registerFormGroup.controls['lastName'].value
    ) {
      this.error = 'Please fill all fields';
      return;
    }

    this.authService
      .register(
        this.registerFormGroup.value.email,
        this.registerFormGroup.value.firstName,
        this.registerFormGroup.value.lastName,
        this.registerFormGroup.value.password
      )
      .subscribe({
        error: (error) => {
          // TODO: show error
          console.log('Error', error);
          this.error = error;
        },
      });
  }

  redirectToLogin() {
    this.router.navigateByUrl('login');
  }
}
