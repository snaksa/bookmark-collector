import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Bookmark } from 'src/app/modules/shared/models/bookmark.model';
import { LabelsService } from '../../../labels/services/labels.service';
import { Label } from '../../../../shared/models/label.model';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { State } from '../../state/bookmarks.state';
import { deleteLabelAction, updateLabelAction } from '../../../labels/state/labels.actions';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EditLabelDialogComponent } from '../../../labels/components/edit-label-dialog/edit-label-dialog.component';

@Component({
  selector: 'app-tag-bookmarks',
  templateUrl: './tag-bookmarks.component.html'
})
export class TagBookmarksComponent implements OnInit {
  isLoading: boolean = true;
  label: Label = {
    id: '',
    title: '',
    bookmarks: [],
    color: ''
  };

  actions = [
    {
      icon: 'edit',
      action: 'edit',
      label: 'Edit'
    },
    {
      icon: 'delete_outline',
      action: 'delete',
      label: 'Delete'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private labelsService: LabelsService,
    private titleService: Title,
    private store: Store<State>,
    private dialog: MatDialog
  ) {
    this.titleService.setTitle(`# | Sinilinx`);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.isLoading = true;
      this.label = {
        id: '',
        title: '',
        bookmarks: [],
        color: ''
      };

      this.labelsService.getLabelBookmarks(params.id).subscribe((data) => {
        this.label = data;
        this.isLoading = false;

        this.titleService.setTitle(`# ${this.label.title} | Sinilinx`);
      });
    });
  }

  triggerAction(action: string) {
    if (action === 'delete') {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        autoFocus: false,
        position: { top: '200px' },
        data: {
          title: 'Are you sure?',
          subtitle: 'The label will be deleted'
        }
      });

      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.store.dispatch(deleteLabelAction({ id: this.label.id }));
        }
      });
    } else if (action === 'edit') {
      const dialogRef = this.dialog.open(EditLabelDialogComponent, {
        width: '30%',
        data: {
          title: this.label.title
        }
      });

      dialogRef.afterClosed().subscribe((value) => {
        if (value) {
          this.label.title = value;
          this.store.dispatch(updateLabelAction({ id: this.label.id, title: value }));
        }
      });
    }
  }

  toggleFavoriteBookmark(bookmark: Bookmark) {
    this.label.bookmarks.forEach((item, index) => {
      if (item.id === bookmark.id) {
        this.label.bookmarks[index].isFavorite = bookmark.isFavorite;
      }
    });
  }

  toggleArchiveBookmark(bookmark: Bookmark) {
    this.label.bookmarks.forEach((item, index) => {
      if (item.id === bookmark.id) {
        this.label.bookmarks[index].isArchived = bookmark.isArchived;
      }
    });
  }

  deleteBookmark(bookmark: Bookmark) {
    this.label.bookmarks = this.label.bookmarks.filter((item) => item.id !== bookmark.id);
  }
}
