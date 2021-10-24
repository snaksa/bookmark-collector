import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MyListComponent } from './pages/my-list/my-list.component';
import { SharedModule } from '../../shared/shared.module';
import { BookmarkViewComponent } from './components/bookmark-view/bookmark-view.component';
import { BookmarksListComponent } from './components/bookmarks-list/bookmarks-list.component';
import { FavoriteListComponent } from './pages/favorite-list/favorite-list.component';
import { ArchivedListComponent } from './pages/archived-list/archived-list.component';
import { TagsComponent } from './components/tags/tags.component';
import { TagBookmarksComponent } from './pages/tag-bookmarks/tag-bookmarks.component';
import { BookmarksLayoutComponent } from './components/bookmarks-layout/bookmarks-layout.component';
import { TagsDialogComponent } from './components/tags-dialog/tags-dialog.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { bookmarksReducer } from './state/bookmarks.reducer';
import { BookmarksEffects } from './state/bookmarks.effects';
import { AuthenticatedLayoutComponent } from '../layout/authenticated-layout.component';
import { AuthenticatedLayoutModule } from '../layout/authenticated-layout.module';
import { CoreModule } from '../../core/core.module';
import { AddBookmarkDialogComponent } from './components/bookmarks-layout/add-bookmark-dialog/add-bookmark-dialog.component';
import { LabelsModule } from '../labels/labels.module';

const routes = [
  {
    path: '',
    component: AuthenticatedLayoutComponent,
    children: [
      {
        path: '',
        component: BookmarksLayoutComponent,
        children: [
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
          {
            path: 'tags',
            component: TagsComponent,
          },
          {
            path: 'tags/:id',
            component: TagBookmarksComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [
    MyListComponent,
    FavoriteListComponent,
    ArchivedListComponent,
    TagsComponent,
    BookmarksListComponent,
    BookmarkViewComponent,
    TagBookmarksComponent,
    BookmarksLayoutComponent,
    TagsDialogComponent,
    AddBookmarkDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    AuthenticatedLayoutModule,
    LabelsModule,
    RouterModule.forChild(routes),

    StoreModule.forFeature('bookmarks', bookmarksReducer),
    EffectsModule.forFeature([BookmarksEffects]),
  ],
})
export class BookmarksModule {}
