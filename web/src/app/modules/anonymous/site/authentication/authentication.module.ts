import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationWrapperComponent } from './components/authentication-wrapper/authentication-wrapper.component';
import { AuthenticationWrapperSideComponent } from './components/authentication-wrapper-side/authentication-wrapper-side.component';
import { AuthenticationRedirectButtonComponent } from './components/authentication-redirect-button/authentication-redirect-button.component';
import { AuthenticationFormComponent } from './components/authentication-form/authentication-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../../../core/core.module';
import { SharedModule } from '../../../shared/shared.module';

const routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];

@NgModule({
  declarations: [
    AuthenticationWrapperComponent,
    AuthenticationWrapperSideComponent,
    AuthenticationRedirectButtonComponent,
    AuthenticationFormComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CoreModule
  ],
  exports: [RouterModule]
})
export class AuthenticationModule {
}
