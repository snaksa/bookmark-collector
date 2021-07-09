import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {State} from "../../state/bookmarks.state";
import {Store} from "@ngrx/store";
import {createBookmarkAction} from "../../state/bookmarks.actions";

@Component({
  selector: 'app-bookmarks-layout',
  templateUrl: './bookmarks-layout.component.html',
  styleUrls: ['./bookmarks-layout.component.scss'],
})
export class BookmarksLayoutComponent {
  newBookmarkFormGroup: FormGroup = new FormGroup({
    bookmark: new FormControl('', Validators.required),
  });

  constructor(private store: Store<State>) {
  }

  public onSubmit() {
    const url = this.newBookmarkFormGroup.controls['bookmark'].value;
    this.store.dispatch(createBookmarkAction({url}));
  }
}
