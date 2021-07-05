import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from './state/users.state';
import { getCurrentUserSelector } from './state/users.selectors';
import { User } from '../modules/shared/models/user.model';
import { loadUserAction } from './state/users.actions';

@Component({
  selector: 'app-authenticated-layout',
  templateUrl: './authenticated-layout.component.html',
  styleUrls: ['./authenticated-layout.component.scss'],
})
export class AuthenticatedLayoutComponent implements OnInit {
  constructor(private store: Store<State>) {}
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
