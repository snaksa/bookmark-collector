import { Component, OnInit } from '@angular/core';
import { Bookmark } from '../../../shared/models/bookmark.model';
import { BookmarksService } from '../../services/bookmarks.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.scss'],
})
export class MyListComponent implements OnInit {
  bookmarks: Bookmark[] = [];

  constructor(private bookmarkService: BookmarksService) {}

  ngOnInit(): void {
    this.bookmarkService.getBookmarks().subscribe((data) => {
      this.bookmarks = data;
    });
  }

  favoriteBookmark(id: string) {
    console.log('Favorite bookmark', id);
  }

  archiveBookmark(id: string) {
    console.log('Archive bookmark', id);
  }

  deleteBookmark(id: string) {
    console.log('Delete bookmark', id);
  }
}
