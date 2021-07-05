import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../state/app.state';
import { Store } from '@ngrx/store';
import { Label } from '../../../modules/shared/models/label.model';
import { getLabelsSelector } from '../../../modules/labels/state/labels.selectors';
import { loadLabelsAction } from '../../../modules/labels/state/labels.actions';
import { getCurrentUserSelector } from '../../state/users.selectors';
import { State } from '../../state/users.state';
import { User } from '../../../modules/shared/models/user.model';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  labels: Label[] = [];
  currentUser: User = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
  };

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.store.select(getLabelsSelector).subscribe((labels) => {
      if (!labels.isInitialized && !labels.isLoading) {
        this.store.dispatch(loadLabelsAction());
      }
      this.labels = labels.data;
    });

    this.store.select(getCurrentUserSelector).subscribe((currentUser) => {
      this.currentUser = currentUser.data;
    });
  }

  generateLabelURL(label: Label) {
    return `/bookmarks/tags/${label.id}`;
  }
}
