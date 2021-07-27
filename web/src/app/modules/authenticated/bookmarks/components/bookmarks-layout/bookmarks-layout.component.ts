import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { State } from '../../state/bookmarks.state';
import { Store } from '@ngrx/store';
import { createBookmarkAction } from '../../state/bookmarks.actions';
import { Observable, Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AddBookmarkDialogComponent } from './add-bookmark-dialog/add-bookmark-dialog.component';

@Component({
  selector: 'app-bookmarks-layout',
  templateUrl: './bookmarks-layout.component.html',
  styleUrls: ['./bookmarks-layout.component.scss'],
})
export class BookmarksLayoutComponent implements OnInit, OnDestroy {
  isHandset = false;
  changes: Subscription = new Subscription();
  disabled = true;
  bookmarkControl = new FormControl('');

  constructor(private breakpointObserver: BreakpointObserver, private dialog: MatDialog, private store: Store<State>) {}

  ngOnInit() {
    this.changes = this.bookmarkControl.valueChanges.subscribe((value) => {
      this.disabled = !value;
    });

    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
        map((result) => result.matches),
        shareReplay()
      )
      .subscribe((handset) => {
        this.isHandset = handset;
      });
  }

  ngOnDestroy() {
    this.changes.unsubscribe();
  }

  public onSubmit() {
    const url = this.bookmarkControl.value;
    this.store.dispatch(createBookmarkAction({ url }));
    this.bookmarkControl.setValue('');
  }

  showDialog() {
    const dialogRef = this.dialog.open(AddBookmarkDialogComponent, {
      width: '90%',
    });

    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.store.dispatch(createBookmarkAction({ url: value }));
      }
    });
  }
}
