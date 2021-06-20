import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MyListComponent } from './components/my-list/my-list.component';
import { SharedModule } from '../shared/shared.module';
import { BookmarkViewComponent } from './components/bookmark-view/bookmark-view.component';

const routes = [
  {
    path: '',
    redirectTo: 'my-list',
    pathMatch: 'full',
  },
  {
    path: 'my-list',
    component: MyListComponent,
  },
];

@NgModule({
  declarations: [MyListComponent, BookmarkViewComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class BookmarksModule {}
