import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss']
})
export class RecoverComponent {
  generalError = '';
  recoverFormGroup: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email])
    },
    {
      updateOn: 'submit'
    }
  );

  constructor(private authService: AuthService, private router: Router, private titleService: Title) {
    this.titleService.setTitle('Recover Account | Sinilinx');
  }

  get emailControl() {
    return this.recoverFormGroup.get('email')!;
  }

  onSubmit() {
    this.generalError = '';
    if (!this.recoverFormGroup.valid) {
      return;
    }

    this.authService.recoverAccount(this.recoverFormGroup.value.email).subscribe({
      next: () => {
        this.generalError = "Recovery email was sent";
      },
      error: (error) => {
        this.generalError = error.message;
      }
    });
  }
}
