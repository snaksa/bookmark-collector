import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Bookmark } from '../../../../shared/models/bookmark.model';
import { BookmarkType } from '../../state/bookmark-type.enum';
import { loadBookmarksAction } from '../../state/bookmarks.actions';
import { getBookmarksListSelector } from '../../state/bookmarks.selectors';
import { State } from '../../state/bookmarks.state';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
})
export class MyListComponent implements OnInit {
  bookmarks: Bookmark[] = [];
  isLoading = false;
  error = '';

  constructor(private store: Store<State>, private titleService: Title) {
    this.titleService.setTitle('All Bookmarks | Sinilinx');
  }

  ngOnInit(): void {
    this.store.select(getBookmarksListSelector).subscribe((list) => {
      this.bookmarks = list.data;
      this.isLoading = list.isLoading;
      this.error = list.error;

      if (!list.isInitialized && !list.isLoading) {
        this.store.dispatch(loadBookmarksAction({ key: BookmarkType.List }));
      }
    });
  }
}
