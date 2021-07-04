import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../state/app.state';
import { Store } from '@ngrx/store';
import { Label } from '../../../modules/shared/models/label.model';
import { getLabelsSelector } from '../../../modules/labels/state/labels.selectors';
import { loadLabelsAction } from '../../../modules/labels/state/labels.actions';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  labels: Label[] = [];

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.select(getLabelsSelector).subscribe((labels) => {
      if (!labels.isInitialized && !labels.isLoading) {
        this.store.dispatch(loadLabelsAction());
      }
      this.labels = labels.data;
    });
  }
}
