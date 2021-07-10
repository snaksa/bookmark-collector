import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../../shared/shared.module';
import { AnonymousLayoutComponent } from '../layout/anonymous-layout.component';
import { AnonymousLayoutModule } from '../layout/anonymous-layout.modue';
import { CoreModule } from '../../core/core.module';

const routes = [
  {
    path: '',
    component: AnonymousLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [HomeComponent, LoginComponent, RegisterComponent],
  imports: [CommonModule, SharedModule, AnonymousLayoutModule, RouterModule.forChild(routes), CoreModule],
  exports: [RouterModule],
})
export class SiteModule {}
