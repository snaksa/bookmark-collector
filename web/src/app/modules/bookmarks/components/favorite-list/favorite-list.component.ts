import { Component, OnInit } from '@angular/core';
import { Bookmark } from 'src/app/modules/shared/models/bookmark.model';
import { BookmarksService } from '../../services/bookmarks.service';

@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.scss']
})
export class FavoriteListComponent implements OnInit {

  bookmarks: Bookmark[] = [];

  constructor(private bookmarkService: BookmarksService) {}

  ngOnInit(): void {
    this.bookmarkService.getBookmarks(true).subscribe((data) => {
      this.bookmarks = data;
    });
  }

  toggleFavoriteBookmark(bookmark: Bookmark) {
    this.bookmarks = this.bookmarks.filter((item) => item.id !== bookmark.id);
  }

  toggleArchiveBookmark(bookmark: Bookmark) {
    this.bookmarks.forEach((item, index) => {
      if(item.id === bookmark.id) {
        this.bookmarks[index].isArchived = bookmark.isArchived;
      }
    });
  }

  deleteBookmark(bookmark: Bookmark) {
    this.bookmarks = this.bookmarks.filter((item) => item.id !== bookmark.id);
  }

}
