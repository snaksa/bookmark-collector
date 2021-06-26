import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Bookmark } from '../../../shared/models/bookmark.model';
import { Label } from '../../../shared/models/label.model';
import { MatDialog } from '@angular/material/dialog';
import { TagsDialogComponent } from '../tags-dialog/tags-dialog.component';

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

  baseUrl: string = '';

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    const pathArray = this.bookmark.url.split('/');
    this.baseUrl = pathArray[2];
  }

  favoriteBookmark() {
    this.toggleFavorite.emit(this.bookmark);
  }

  archiveBookmark() {
    this.toggleArchive.emit(this.bookmark);
  }

  deleteBookmark() {
    this.onDelete.emit(this.bookmark);
  }

  generateTagUrl(label: Label) {
    return `/bookmarks/tags/${label.id}`;
  }

  openTagDialog() {
    const dialogRef = this.dialog.open(TagsDialogComponent, {
      width: '600px',
      autoFocus: false,
      position: { top: '200px' },
      data: { id: this.bookmark.id },
    });
  }
}
