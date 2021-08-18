import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Label } from '../../../../shared/models/label.model';
import { getLabelsSelector } from '../../../labels/state/labels.selectors';
import { loadLabelsAction } from '../../../labels/state/labels.actions';
import { User } from '../../../../shared/models/user.model';
import { getCurrentUserSelector } from 'src/app/state/app.selectors';
import { AppState } from 'src/app/state/app.state';
import { AuthService } from '../../../../shared/services/auth.service';

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

  constructor(private store: Store<AppState>, private authService: AuthService) {}

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

  logout() {
    this.authService.logout();
  }
}
