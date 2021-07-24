import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Bookmark } from '../../../../shared/models/bookmark.model';
import { Label } from '../../../../shared/models/label.model';
import { MatDialog } from '@angular/material/dialog';
import { TagsDialogComponent } from '../tags-dialog/tags-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../state/app.state';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-bookmark-view',
  templateUrl: './bookmark-view.component.html',
  styleUrls: ['./bookmark-view.component.scss']
})
export class BookmarkViewComponent implements OnInit {
  @Input() bookmark: Bookmark = {
    id: '',
    title: '',
    image: '',
    url: '',
    isFavorite: false,
    isArchived: false,
    labels: []
  };

  @Output() onDelete = new EventEmitter<Bookmark>();
  @Output() toggleFavorite = new EventEmitter<Bookmark>();
  @Output() toggleArchive = new EventEmitter<Bookmark>();

  baseUrl: string = '';
  isHandset = false;

  constructor(private breakpointObserver: BreakpointObserver, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    const pathArray = this.bookmark.url.split('/');
    this.baseUrl = pathArray[2];

    this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      )
      .subscribe(handset => {
        this.isHandset = handset;
      });
  }

  favoriteBookmark() {
    this.toggleFavorite.emit(this.bookmark);
  }

  archiveBookmark() {
    this.toggleArchive.emit(this.bookmark);
  }

  deleteBookmark() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      autoFocus: false,
      position: { top: '200px' },
      data: {
        title: 'Are you sure?',
        subtitle: 'The bookmark will be deleted'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.onDelete.emit(this.bookmark);
      }
    });
  }

  generateTagUrl(label: Label) {
    return `/bookmarks/tags/${label.id}`;
  }

  openTagDialog() {
    const dialogRef = this.dialog.open(TagsDialogComponent, {
      width: '600px',
      autoFocus: false,
      position: { top: '200px' },
      data: { id: this.bookmark.id }
    });
  }
}