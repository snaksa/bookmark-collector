import { Component, Input } from '@angular/core';
import { Bookmark } from 'src/app/modules/shared/models/bookmark.model';
import { BookmarksService } from '../../services/bookmarks.service';

@Component({
  selector: 'app-bookmarks-list',
  templateUrl: './bookmarks-list.component.html',
  styleUrls: ['./bookmarks-list.component.scss']
})
export class BookmarksListComponent {
  @Input() bookmarks: Bookmark[] = [];

  constructor(private bookmarksService: BookmarksService) {}

  toggleFavoriteBookmark(bookmark: Bookmark) {
    this.bookmarksService.updateBookmark(bookmark.id, {isFavorite: !bookmark.isFavorite}).subscribe((res) => {
      this.bookmarks.forEach((item, index) => {
        if(item.id === res.id) {
          this.bookmarks[index].isFavorite = res.isFavorite;
        }
      });
    });
  }

  toggleArchiveBookmark(bookmark: Bookmark) {
    this.bookmarksService.updateBookmark(bookmark.id, {isArchived: !bookmark.isArchived}).subscribe((res) => {
      this.bookmarks.forEach((item, index) => {
        if(item.id === res.id) {
          this.bookmarks[index].isArchived = res.isArchived;
        }
      });
    });
  }

  deleteBookmark(bookmark: Bookmark) {
    this.bookmarksService.deleteBookmark(bookmark.id).subscribe((res) => {
      this.bookmarks = this.bookmarks.filter((item) => item.id !== bookmark.id);
    });
  }

}
