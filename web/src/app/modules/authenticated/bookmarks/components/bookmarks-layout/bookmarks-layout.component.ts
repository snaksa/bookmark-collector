import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { State } from '../../state/bookmarks.state';
import { Store } from '@ngrx/store';
import { createBookmarkAction } from '../../state/bookmarks.actions';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-bookmarks-layout',
  templateUrl: './bookmarks-layout.component.html',
  styleUrls: ['./bookmarks-layout.component.scss'],
})
export class BookmarksLayoutComponent implements OnInit, OnDestroy {
  changes: Subscription = new Subscription();
  disabled = true;
  newBookmarkFormGroup: FormGroup = new FormGroup({
    bookmark: new FormControl(''),
  });

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.changes = this.newBookmarkFormGroup.controls['bookmark'].valueChanges.subscribe((value) => {
      this.disabled = !value;
    });
  }

  ngOnDestroy() {
    this.changes.unsubscribe();
  }

  public onSubmit() {
    const url = this.newBookmarkFormGroup.controls['bookmark'].value;
    this.store.dispatch(createBookmarkAction({ url }));
    this.newBookmarkFormGroup.controls['bookmark'].setValue('');
  }
}
