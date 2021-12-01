import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent {
  code = '';
  username = '';
  generalError = '';
  resetFormGroup: FormGroup = new FormGroup(
    {
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    },
    {
      updateOn: 'submit'
    }
  );

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle('Reset Password | Sinilinx');

    this.route.queryParams.subscribe((params) => {
      this.emailControl.setValue(params.username);
      this.emailControl.disable();

      this.username = params.username;
      this.code = params.code;
    });
  }

  get emailControl() {
    return this.resetFormGroup.get('email')!;
  }

  get passwordControl() {
    return this.resetFormGroup.get('password')!;
  }

  onSubmit() {
    this.generalError = '';
    if (!this.resetFormGroup.valid) {
      return;
    }

    this.authService.resetPassword(
      this.username,
      this.resetFormGroup.value.password,
      this.code
    ).subscribe({
      next: () => {
        this.generalError = 'Password reset successfully';
      },
      error: (error) => {
        this.generalError = error.message;
      }
    });
  }
}
