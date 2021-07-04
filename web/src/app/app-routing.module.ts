import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnonymousLayoutComponent } from './anonymous-layout/anonymous-layout.component';
import { AuthenticatedLayoutComponent } from './authenticated-layout/authenticated-layout.component';
import { AuthenticatedGuard } from './guards/authenticated.guard';

const routes: Routes = [
  {
    path: '',
    component: AnonymousLayoutComponent,
    loadChildren: () =>
      import('./modules/site/site.module').then((m) => m.SiteModule),
  },
  {
    path: 'user',
    component: AuthenticatedLayoutComponent,
    canActivate: [AuthenticatedGuard],
    loadChildren: () =>
      import('./modules/users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'bookmarks',
    component: AuthenticatedLayoutComponent,
    canActivate: [AuthenticatedGuard],
    loadChildren: () =>
      import('./modules/bookmarks/bookmarks.module').then(
        (m) => m.BookmarksModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
