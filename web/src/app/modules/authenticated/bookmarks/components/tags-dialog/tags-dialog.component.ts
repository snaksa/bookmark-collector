import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Label } from '../../../../shared/models/label.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BookmarksService } from '../../services/bookmarks.service';
import { LabelsService } from '../../../labels/services/labels.service';
import { Store } from '@ngrx/store';
import { State } from '../../state/bookmarks.state';
import { updateBookmarkTagsAction } from '../../state/bookmarks.actions';

@Component({
  selector: 'app-tags-dialog',
  templateUrl: './tags-dialog.component.html',
  styleUrls: ['./tags-dialog.component.scss'],
})
export class TagsDialogComponent {
  constructor(
    private store: Store<State>,
    private bookmarkService: BookmarksService,
    private labelsService: LabelsService,
    public dialogRef: MatDialogRef<TagsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) {}

  loadingBookmark = true;
  loadingLabels = true;
  inputControl = new FormControl();
  options: Label[] = [];
  filteredOptions: Observable<Label[]> = new Observable<Label[]>();

  selectedLabels: Label[] = [];

  ngOnInit() {
    this.bookmarkService.getBookmark(this.data.id).subscribe((bookmark) => {
      this.selectedLabels = bookmark.labels;
      this.loadingBookmark = false;
    });

    this.labelsService.getLabels().subscribe((labels) => {
      this.options = labels;
      this.loadingLabels = false;
    });

    this.filteredOptions = this.inputControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  public get loading() {
    return this.loadingLabels || this.loadingBookmark;
  }

  private _filter(value: string): Label[] {
    const filterValue = value.toLowerCase();

    if (value.length > 0 && value.substr(-1, 1) === ',') {
      this.createTag(value.substr(0, value.length - 1));
      return [];
    }

    return this.options.filter(
      (option) =>
        option.title.toLowerCase().includes(filterValue) && !this.selectedLabels.find((label) => label.id === option.id)
    );
  }

  optionSelected(event: MatAutocompleteSelectedEvent) {
    const id = event.option.id;
    this.options.forEach((item: Label) => {
      if (item.id === id) {
        this.selectedLabels.push(item);
      }
    });
    this.inputControl.setValue('');
  }

  createTag(title: string) {
    const label: Label = {
      id: `new_${Date.now().toString()}`,
      title: title,
      color: '#ccc',
      bookmarks: [],
    };
    this.selectedLabels.push(label);
    this.inputControl.setValue('');
  }

  removeLabel(id: string) {
    this.selectedLabels = this.selectedLabels.filter((label) => label.id !== id);
  }

  onSubmit() {
    const newLabels: string[] = [];
    const existingLabels: string[] = [];
    this.selectedLabels.forEach((option) => {
      if (option.id.startsWith('new_')) {
        newLabels.push(option.title);
      } else {
        existingLabels.push(option.id);
      }
    });

    this.store.dispatch(
      updateBookmarkTagsAction({
        bookmarkId: this.data.id,
        newLabels: newLabels,
        labelIds: existingLabels,
      })
    );

    this.onClose();
  }

  onClose() {
    this.dialogRef.close();
  }
}
