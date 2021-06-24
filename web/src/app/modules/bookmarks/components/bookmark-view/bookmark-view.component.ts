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

  @Output() onDelete = new EventEmitter<Bookmark>();
  @Output() toggleFavorite = new EventEmitter<Bookmark>();
  @Output() toggleArchive = new EventEmitter<Bookmark>();

  constructor() {}

  ngOnInit(): void {}

  favoriteBookmark() {
    this.toggleFavorite.emit(this.bookmark);
  }

  archiveBookmark() {
    this.toggleArchive.emit(this.bookmark);
  }

  deleteBookmark() {
    this.onDelete.emit(this.bookmark);
  }
}
