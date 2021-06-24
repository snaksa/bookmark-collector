import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MyListComponent } from './components/my-list/my-list.component';
import { SharedModule } from '../shared/shared.module';
import { BookmarkViewComponent } from './components/bookmark-view/bookmark-view.component';
import { BookmarksListComponent } from './components/bookmarks-list/bookmarks-list.component';

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
  declarations: [MyListComponent, BookmarksListComponent, BookmarkViewComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class BookmarksModule {}
