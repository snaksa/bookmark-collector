import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  generalError = '';
  registerFormGroup: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    },
    {
      updateOn: 'submit'
    }
  );

  constructor(private authService: AuthService, private router: Router, private titleService: Title) {
    this.titleService.setTitle('Sign Up | Sinilinx');
  }

  get firstNameControl() {
    return this.registerFormGroup.get('firstName')!;
  }

  get lastNameControl() {
    return this.registerFormGroup.get('lastName')!;
  }

  get emailControl() {
    return this.registerFormGroup.get('email')!;
  }

  get passwordControl() {
    return this.registerFormGroup.get('password')!;
  }

  onSubmit() {
    this.generalError = '';
    if (!this.registerFormGroup.valid) {
      return;
    }

    this.authService
      .register(
        this.emailControl.value,
        this.firstNameControl.value,
        this.lastNameControl.value,
        this.passwordControl.value
      )
      .subscribe({
        next: () => {
          this.generalError = 'Confirmation email was sent!';
        },
        error: (error) => {
          this.generalError = error.message;
        }
      });
  }

  redirectToLogin() {
    this.router.navigateByUrl('login');
  }
}
