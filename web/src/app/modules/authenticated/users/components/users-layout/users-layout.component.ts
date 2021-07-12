import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getCurrentUserSelector } from 'src/app/state/app.selectors';
import { AppState } from 'src/app/state/app.state';
import { User } from '../../../../shared/models/user.model';
import { updateUserAction } from '../../../../../state/app.actions';

@Component({
  selector: 'app-users-layout',
  templateUrl: './users-layout.component.html',
  styleUrls: ['./users-layout.component.scss'],
})
export class UsersLayoutComponent implements OnInit {
  currentUser: User = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
  };
  updating = false;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.select(getCurrentUserSelector).subscribe((currentUser) => {
      this.currentUser = currentUser.data;
      this.updating = currentUser.updating;
    });
  }

  updateUser(event: { firstName: string; lastName: string; email: string }) {
    this.store.dispatch(updateUserAction({ firstName: event.firstName, lastName: event.lastName, email: event.email }));
  }
}
