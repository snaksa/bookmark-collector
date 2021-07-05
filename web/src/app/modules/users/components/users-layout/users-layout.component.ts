import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getCurrentUserSelector } from '../../../../authenticated-layout/state/users.selectors';
import { UsersState } from '../../../../authenticated-layout/state/users.state';
import { User } from '../../../shared/models/user.model';

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

  constructor(private store: Store<UsersState>) {}

  ngOnInit(): void {
    this.store.select(getCurrentUserSelector).subscribe((currentUser) => {
      this.currentUser = currentUser.data;
    });
  }
}
