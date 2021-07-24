import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Bookmark } from 'src/app/modules/shared/models/bookmark.model';
import { BookmarkType } from '../../state/bookmark-type.enum';
import { loadBookmarksAction } from '../../state/bookmarks.actions';
import { getFavoriteBookmarksSelector } from '../../state/bookmarks.selectors';
import { State } from '../../state/bookmarks.state';

@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.component.html',
})
export class FavoriteListComponent implements OnInit {
  bookmarks: Bookmark[] = [];
  isLoading = false;
  error = '';

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.store.select(getFavoriteBookmarksSelector).subscribe((list) => {
      if (!list.isInitialized && !list.isLoading) {
        this.store.dispatch(loadBookmarksAction({ key: BookmarkType.Favorites }));
      }

      this.bookmarks = list.data;
      this.isLoading = list.isLoading;
      this.error = list.error;
    });
  }

  toggleFavoriteBookmark(bookmark: Bookmark) {
    // this.bookmarks = this.bookmarks.filter((item) => item.id !== bookmark.id);
  }

  toggleArchiveBookmark(bookmark: Bookmark) {
    // this.bookmarks.forEach((item, index) => {
    //   if (item.id === bookmark.id) {
    //     this.bookmarks[index].isArchived = bookmark.isArchived;
    //   }
    // });
  }

  deleteBookmark(bookmark: Bookmark) {
    // this.bookmarks = this.bookmarks.filter((item) => item.id !== bookmark.id);
  }
}
