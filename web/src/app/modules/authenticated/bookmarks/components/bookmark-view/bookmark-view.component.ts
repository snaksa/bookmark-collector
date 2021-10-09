import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Bookmark } from '../../../../shared/models/bookmark.model';
import { Label } from '../../../../shared/models/label.model';
import { MatDialog } from '@angular/material/dialog';
import { TagsDialogComponent } from '../tags-dialog/tags-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

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

  imageLoadError: boolean = false;
  baseUrl: string = '';
  isHandset = false;

  constructor(private breakpointObserver: BreakpointObserver, private dialog: MatDialog) {}

  ngOnInit(): void {
    const pathArray = this.bookmark.url.split('/');
    this.baseUrl = pathArray[2];

    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(
        map((result) => result.matches),
        shareReplay()
      )
      .subscribe((handset) => {
        this.isHandset = handset;
      });
  }

  openUrl() {
    (window as any).open(this.bookmark.url, '_blank');
  }

  favoriteBookmark($event: any) {
    $event.stopPropagation();
    this.toggleFavorite.emit(this.bookmark);
  }

  archiveBookmark($event: any) {
    $event.stopPropagation();
    this.toggleArchive.emit(this.bookmark);
  }

  deleteBookmark($event: any) {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      autoFocus: false,
      position: { top: '200px' },
      data: {
        title: 'Are you sure?',
        subtitle: 'The bookmark will be deleted',
      },
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

  openTagDialog($event: any) {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(TagsDialogComponent, {
      width: '600px',
      autoFocus: false,
      position: { top: '200px' },
      data: { id: this.bookmark.id },
    });
  }

  imageLoadErrorHandler() {
    this.imageLoadError = true;
  }
}
