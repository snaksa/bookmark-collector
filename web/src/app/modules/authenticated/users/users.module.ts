import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersLayoutComponent } from './components/users-layout/users-layout.component';
import { RouterModule } from '@angular/router';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { AccountComponent } from './components/user-details/tabs/account/account.component';
import { SharedModule } from '../../shared/shared.module';
import { SecurityComponent } from './components/user-details/tabs/security/security.component';
import { AuthenticatedLayoutComponent } from '../layout/authenticated-layout.component';
import { AuthenticatedLayoutModule } from '../layout/authenticated-layout.module';
import { CoreModule } from '../../core/core.module';

const routes = [
  {
    path: '',
    component: AuthenticatedLayoutComponent,
    children: [
      {
        path: '',
        component: UsersLayoutComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [UsersLayoutComponent, UserDetailsComponent, AccountComponent, SecurityComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes), AuthenticatedLayoutModule, CoreModule],
})
export class UsersModule {}
