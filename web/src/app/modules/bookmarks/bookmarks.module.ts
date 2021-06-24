import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MyListComponent } from './components/my-list/my-list.component';
import { SharedModule } from '../shared/shared.module';
import { BookmarkViewComponent } from './components/bookmark-view/bookmark-view.component';
import { BookmarksListComponent } from './components/bookmarks-list/bookmarks-list.component';
import { FavoriteListComponent } from './components/favorite-list/favorite-list.component';
import { ArchivedListComponent } from './components/archived-list/archived-list.component';

const routes = [
  {
    path: '',
    redirectTo: 'my-list',
    pathMatch: 'full',
  },
  {
    path: 'my-list',
    component: MyListComponent,
  },
  {
    path: 'favorites',
    component: FavoriteListComponent,
  },
  {
    path: 'archived',
    component: ArchivedListComponent,
  },
];

@NgModule({
  declarations: [MyListComponent, FavoriteListComponent, ArchivedListComponent, BookmarksListComponent, BookmarkViewComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class BookmarksModule {}
