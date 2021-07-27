import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  generalError = '';
  loginFormGroup: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    },
    {
      updateOn: 'submit',
    }
  );

  constructor(private authService: AuthService, private router: Router) {}

  get emailControl() {
    return this.loginFormGroup.get('email')!;
  }

  get passwordControl() {
    return this.loginFormGroup.get('password')!;
  }

  onSubmit() {
    this.generalError = '';
    if (!this.loginFormGroup.valid) {
      return;
    }

    this.authService.login(this.loginFormGroup.value.email, this.loginFormGroup.value.password).subscribe({
      error: (error) => {
        this.generalError = error.message;
      },
    });
  }

  redirectToRegister() {
    this.router.navigateByUrl('register');
  }
}
