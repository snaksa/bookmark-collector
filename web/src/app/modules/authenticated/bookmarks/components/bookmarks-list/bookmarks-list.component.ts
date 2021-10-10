import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Bookmark } from 'src/app/modules/shared/models/bookmark.model';
import { BookmarksService } from '../../services/bookmarks.service';
import { Store } from '@ngrx/store';
import { State } from '../../state/bookmarks.state';
import {
  toggleArchiveBookmarkAction,
  deleteBookmarkAction,
  toggleFavoriteBookmarkAction
} from '../../state/bookmarks.actions';

@Component({
  selector: 'app-bookmarks-list',
  templateUrl: './bookmarks-list.component.html',
  styleUrls: ['./bookmarks-list.component.scss']
})
export class BookmarksListComponent {
  @Input() header: string = 'All bookmarks';
  @Input() icon: string = 'home';
  @Input() bookmarks: Bookmark[] = [];
  @Input() isLoading: boolean = false;

  @Output() onFavoriteToggle = new EventEmitter<Bookmark>();
  @Output() onArchiveToggle = new EventEmitter<Bookmark>();
  @Output() onDeleteToggle = new EventEmitter<Bookmark>();

  @Input() actions: { icon: string; action: string; label: string; }[] = [];
  @Output() onAction = new EventEmitter<string>();

  constructor(private bookmarksService: BookmarksService, private store: Store<State>) {
  }

  triggerAction(action: string) {
    this.onAction.emit(action);
  }

  trackBy(index: number, item: Bookmark) {
    return item.id;
  }

  toggleFavoriteBookmark(bookmark: Bookmark) {
    this.store.dispatch(
      toggleFavoriteBookmarkAction({
        bookmarkId: bookmark.id,
        isFavorite: !bookmark.isFavorite
      })
    );

    this.onFavoriteToggle.emit({ ...bookmark, isFavorite: !bookmark.isFavorite });
  }

  toggleArchiveBookmark(bookmark: Bookmark) {
    this.store.dispatch(
      toggleArchiveBookmarkAction({
        bookmarkId: bookmark.id,
        isArchived: !bookmark.isArchived
      })
    );

    this.onArchiveToggle.emit({ ...bookmark, isArchived: !bookmark.isArchived });
  }

  deleteBookmark(bookmark: Bookmark) {
    this.store.dispatch(
      deleteBookmarkAction({
        bookmarkId: bookmark.id
      })
    );

    this.onDeleteToggle.emit(bookmark);
  }
}
