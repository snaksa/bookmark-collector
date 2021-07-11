import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginFormGroup: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    if (!this.loginFormGroup.controls['email'].value || !this.loginFormGroup.controls['password'].value) {
      this.error = 'Please fill all fields';
      return;
    }

    this.authService.login(this.loginFormGroup.value.email, this.loginFormGroup.value.password).subscribe({
      error: (error) => {
        // TODO: show error
        console.log('Error', error);
      },
    });
  }

  redirectToRegister() {
    this.router.navigateByUrl('register');
  }
}
