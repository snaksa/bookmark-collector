import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { User } from '../../shared/models/user.model';
import { loadUserAction } from '../../../state/app.actions';
import { getCurrentUserSelector } from '../../../state/app.selectors';
import { AppState } from '../../../state/app.state';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authenticated-layout',
  templateUrl: './authenticated-layout.component.html',
  styleUrls: ['./authenticated-layout.component.scss'],
})
export class AuthenticatedLayoutComponent implements OnInit {
  currentUser: User = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
  };

  @ViewChild('sidenav')
  sidenav!: MatSidenav;

  isHandset = false;

  constructor(private router: Router, private breakpointObserver: BreakpointObserver, private store: Store<AppState>) {}

  ngOnInit() {
    // get the current user
    this.store.select(getCurrentUserSelector).subscribe((user) => {
      if (!user.isInitialized && !user.isLoading) {
        this.store.dispatch(loadUserAction());
      }

      this.currentUser = user.data;
    });

    // watch for breakpoint changes
    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
        map((result) => result.matches),
        shareReplay()
      )
      .subscribe((handset) => {
        this.isHandset = handset;
      });

    // hide sidebar on routing if on handset device
    this.router.events.subscribe((event) => {
      if (this.isHandset) {
        this.sidenav.close();
      }
    });
  }

  openSidenav() {
    this.sidenav.open();
  }
}
