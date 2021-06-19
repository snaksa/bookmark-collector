import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginFormGroup: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private authService: AuthService) {}

  onSubmit() {
    console.log(this.loginFormGroup.value);
    this.authService
      .login(
        this.loginFormGroup.value.email,
        this.loginFormGroup.value.password
      )
      .subscribe(
        (res) => {
          console.log('Login result: ', res);
        },
        (error) => {
          // TODO: show error
          console.log('Error', error);
        }
      );
  }
}
