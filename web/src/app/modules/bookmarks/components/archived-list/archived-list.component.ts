import { Component, OnInit } from '@angular/core';
import { Bookmark } from 'src/app/modules/shared/models/bookmark.model';
import { BookmarksService } from '../../services/bookmarks.service';

@Component({
  selector: 'app-archived-list',
  templateUrl: './archived-list.component.html',
  styleUrls: ['./archived-list.component.scss']
})
export class ArchivedListComponent implements OnInit {

  bookmarks: Bookmark[] = [];

  constructor(private bookmarkService: BookmarksService) {}

  ngOnInit(): void {
    this.bookmarkService.getBookmarks(false, true).subscribe((data) => {
      this.bookmarks = data;
    });
  }

  toggleFavoriteBookmark(bookmark: Bookmark) {
    this.bookmarks.forEach((item, index) => {
      if(item.id === bookmark.id) {
        this.bookmarks[index].isFavorite = bookmark.isFavorite;
      }
    });  }

  toggleArchiveBookmark(bookmark: Bookmark) {
    this.bookmarks = this.bookmarks.filter((item) => item.id !== bookmark.id);
  }

  deleteBookmark(bookmark: Bookmark) {
    this.bookmarks = this.bookmarks.filter((item) => item.id !== bookmark.id);
  }

}
