import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersLayoutComponent } from './components/users-layout/users-layout.component';
import { RouterModule } from '@angular/router';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AccountComponent } from './components/user-details/tabs/account/account.component';
import { SharedModule } from '../shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SecurityComponent } from './components/user-details/tabs/security/security.component';

const routes = [
  {
    path: '',
    component: UsersLayoutComponent,
  },
];

@NgModule({
  declarations: [UsersLayoutComponent, UserDetailsComponent, AccountComponent, SecurityComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes), MatTabsModule, MatInputModule, MatButtonModule],
})
export class UsersModule {}
