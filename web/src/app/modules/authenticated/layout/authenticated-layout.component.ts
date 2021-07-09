import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from '../../shared/models/user.model';
import { loadUserAction } from '../../../state/app.actions';
import { getCurrentUserSelector } from '../../../state/app.selectors';
import { AppState } from '../../../state/app.state';

@Component({
  selector: 'app-authenticated-layout',
  templateUrl: './authenticated-layout.component.html',
  styleUrls: ['./authenticated-layout.component.scss'],
})
export class AuthenticatedLayoutComponent implements OnInit {
  constructor(private store: Store<AppState>) {}
  currentUser: User = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
  };

  ngOnInit() {
    this.store.select(getCurrentUserSelector).subscribe((user) => {
      if (!user.isInitialized && !user.isLoading) {
        this.store.dispatch(loadUserAction());
      }

      this.currentUser = user.data;
    });
  }
}
