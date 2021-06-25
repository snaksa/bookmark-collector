import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Bookmark } from '../../../shared/models/bookmark.model';
import { BookmarksService } from '../../services/bookmarks.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.scss'],
})
export class MyListComponent implements OnInit {
  bookmarks: Bookmark[] = [];

  newBookmarkFormGroup: FormGroup = new FormGroup({
    bookmark: new FormControl('', Validators.required),
  });

  constructor(private bookmarkService: BookmarksService) {}

  ngOnInit(): void {
    this.bookmarkService.getBookmarks().subscribe((data) => {
      this.bookmarks = data;
    });
  }

  public onSubmit() {
    const url = this.newBookmarkFormGroup.controls['bookmark'].value;
    this.bookmarkService.createBookmark(url).subscribe((response) => {
      this.bookmarks.unshift(response);
    })
  }

  toggleFavoriteBookmark(bookmark: Bookmark) {
    this.bookmarks.forEach((item, index) => {
      if(item.id === bookmark.id) {
        this.bookmarks[index].isFavorite = bookmark.isFavorite;
      }
    });
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