import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MyListComponent } from './components/my-list/my-list.component';
import { SharedModule } from '../shared/shared.module';
import { BookmarkViewComponent } from './components/bookmark-view/bookmark-view.component';
import { BookmarksListComponent } from './components/bookmarks-list/bookmarks-list.component';
import { FavoriteListComponent } from './components/favorite-list/favorite-list.component';
import { ArchivedListComponent } from './components/archived-list/archived-list.component';
import { TagsComponent } from './components/tags/tags.component';
import { TagBookmarksComponent } from './components/tag-bookmarks/tag-bookmarks.component';
import { BookmarksLayoutComponent } from './components/bookmarks-layout/bookmarks-layout.component';
import { TagsDialogComponent } from './components/tags-dialog/tags-dialog.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { bookmarksReducer } from './state/bookmarks.reducer';
import { BookmarksEffects } from './state/bookmarks.effects';

const routes = [
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
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatSelectModule,
    RouterModule.forChild(routes),

    StoreModule.forFeature('bookmarks', bookmarksReducer),
    EffectsModule.forFeature([BookmarksEffects]),
  ],
})
export class BookmarksModule {}
