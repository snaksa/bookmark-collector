import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getCurrentUserSelector } from 'src/app/state/app.selectors';
import { AppState } from 'src/app/state/app.state';
import { User } from '../../../../shared/models/user.model';

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

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.select(getCurrentUserSelector).subscribe((currentUser) => {
      this.currentUser = currentUser.data;
    });
  }
}
