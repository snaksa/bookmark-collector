import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersLayoutComponent } from './components/users-layout/users-layout.component';
import { RouterModule } from '@angular/router';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { MatTabsModule } from '@angular/material/tabs';

const routes = [
  {
    path: '',
    component: UsersLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'details',
        pathMatch: 'full',
      },
      {
        path: 'details',
        component: UserDetailsComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [UsersLayoutComponent, UserDetailsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), MatTabsModule],
})
export class UsersModule {}
