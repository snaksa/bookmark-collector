import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticatedGuard } from './guards/authenticated.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/anonymous/site/site.module').then((m) => m.SiteModule)
  },
  {
    path: 'user',
    canActivate: [AuthenticatedGuard],
    loadChildren: () => import('./modules/authenticated/users/users.module').then((m) => m.UsersModule)
  },
  {
    path: 'bookmarks',
    canActivate: [AuthenticatedGuard],
    loadChildren: () => import('./modules/authenticated/bookmarks/bookmarks.module').then((m) => m.BookmarksModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
