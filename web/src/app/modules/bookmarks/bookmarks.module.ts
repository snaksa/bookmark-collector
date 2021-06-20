import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MyListComponent } from './my-list/my-list.component';

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
  declarations: [MyListComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class BookmarksModule {}