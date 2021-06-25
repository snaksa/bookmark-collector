import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Bookmark } from 'src/app/modules/shared/models/bookmark.model';
import { BookmarksService } from '../../services/bookmarks.service';

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

  constructor(private bookmarksService: BookmarksService) {}

  toggleFavoriteBookmark(bookmark: Bookmark) {
    this.bookmarksService
      .updateBookmark(bookmark.id, { isFavorite: !bookmark.isFavorite })
      .subscribe((res) => {
        this.onFavoriteToggle.emit(res);
      });
  }

  toggleArchiveBookmark(bookmark: Bookmark) {
    this.bookmarksService
      .updateBookmark(bookmark.id, { isArchived: !bookmark.isArchived })
      .subscribe((res) => {
        this.onArchiveToggle.emit(res);
      });
  }

  deleteBookmark(bookmark: Bookmark) {
    this.bookmarksService.deleteBookmark(bookmark.id).subscribe((res) => {
      this.onDeleteToggle.emit(bookmark);
    });
  }
}
