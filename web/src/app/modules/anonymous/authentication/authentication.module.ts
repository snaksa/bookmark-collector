import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationWrapperComponent } from './components/authentication-wrapper/authentication-wrapper.component';
import { AuthenticationWrapperSideComponent } from './components/authentication-wrapper-side/authentication-wrapper-side.component';
import { AuthenticationRedirectButtonComponent } from './components/authentication-redirect-button/authentication-redirect-button.component';
import { AuthenticationFormComponent } from './components/authentication-form/authentication-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AuthenticationWrapperComponent,
    AuthenticationWrapperSideComponent,
    AuthenticationRedirectButtonComponent,
    AuthenticationFormComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [
    AuthenticationWrapperComponent,
    AuthenticationWrapperSideComponent,
    AuthenticationRedirectButtonComponent,
    AuthenticationFormComponent,
  ],
})
export class AuthenticationModule {}
