import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Bookmark} from 'src/app/modules/shared/models/bookmark.model';
import {BookmarksService} from '../../services/bookmarks.service';
import {Store} from "@ngrx/store";
import {State} from "../../state/bookmarks.state";
import {
  toggleArchiveBookmarkAction,
  deleteBookmarkAction,
  toggleFavoriteBookmarkAction
} from "../../state/bookmarks.actions";

@Component({
  selector: 'app-bookmarks-list',
  templateUrl: './bookmarks-list.component.html',
  styleUrls: ['./bookmarks-list.component.scss'],
})
export class BookmarksListComponent {
  @Input() bookmarks: Bookmark[] = [];

  @Output() onFavoriteToggle = new EventEmitter<Bookmark>();
  @Output() onArchiveToggle = new EventEmitter<Bookmark>();
  @Output() onDeleteToggle = new EventEmitter<Bookmark>();

  constructor(private bookmarksService: BookmarksService, private store: Store<State>) {
  }

  trackBy(index: number, item: Bookmark) {
    return item.id;
  }

  toggleFavoriteBookmark(bookmark: Bookmark) {
    this.store.dispatch(
      toggleFavoriteBookmarkAction({
        bookmarkId: bookmark.id, isFavorite: !bookmark.isFavorite
      })
    );
  }

  toggleArchiveBookmark(bookmark: Bookmark) {
    this.store.dispatch(
      toggleArchiveBookmarkAction({
        bookmarkId: bookmark.id, isArchived: !bookmark.isArchived
      })
    );
  }

  deleteBookmark(bookmark: Bookmark) {
    this.store.dispatch(
      deleteBookmarkAction({
        bookmarkId: bookmark.id
      })
    );
  }
}
