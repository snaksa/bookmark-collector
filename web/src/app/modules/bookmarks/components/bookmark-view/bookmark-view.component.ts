import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Bookmark } from '../../../shared/models/bookmark.model';

@Component({
  selector: 'app-bookmark-view',
  templateUrl: './bookmark-view.component.html',
  styleUrls: ['./bookmark-view.component.scss'],
})
export class BookmarkViewComponent implements OnInit {
  @Input() bookmark: Bookmark = {
    id: '',
    title: '',
    image: '',
    url: '',
    isFavorite: false,
    isArchived: false,
    labels: [],
  };

  @Output() onDelete = new EventEmitter<string>();
  @Output() onFavorite = new EventEmitter<string>();
  @Output() onArchive = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  favoriteBookmark() {
    this.onFavorite.emit(this.bookmark.id);
  }

  archiveBookmark() {
    this.onArchive.emit(this.bookmark.id);
  }

  deleteBookmark() {
    this.onDelete.emit(this.bookmark.id);
  }
}
