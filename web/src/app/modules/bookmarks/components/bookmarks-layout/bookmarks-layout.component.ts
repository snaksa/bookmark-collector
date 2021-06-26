import { Component } from '@angular/core';
import { BookmarksService } from '../../services/bookmarks.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bookmarks-layout',
  templateUrl: './bookmarks-layout.component.html',
  styleUrls: ['./bookmarks-layout.component.scss'],
})
export class BookmarksLayoutComponent {
  newBookmarkFormGroup: FormGroup = new FormGroup({
    bookmark: new FormControl('', Validators.required),
  });

  constructor(private bookmarksService: BookmarksService) {}

  public onSubmit() {
    const url = this.newBookmarkFormGroup.controls['bookmark'].value;
    this.bookmarksService.createBookmark(url).subscribe((response) => {
      // this.bookmarks.unshift(response);
    });
  }
}
