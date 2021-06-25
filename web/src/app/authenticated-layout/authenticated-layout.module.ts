import { NgModule } from '@angular/core';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { AuthenticatedLayoutComponent } from './authenticated-layout.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AuthenticatedLayoutComponent, SidenavComponent],
  imports: [
    RouterModule,

    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
  ],
  exports: [AuthenticatedLayoutComponent],
})
export class AuthenticatedLayoutModule {}
