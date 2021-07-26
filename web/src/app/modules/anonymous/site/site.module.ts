import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AnonymousLayoutComponent } from '../layout/anonymous-layout.component';
import { AnonymousLayoutModule } from '../layout/anonymous-layout.modue';
import { CoreModule } from '../../core/core.module';
import { AuthenticationModule } from './authentication/authentication.module';

const routes = [
  {
    path: '',
    component: AnonymousLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AnonymousLayoutModule,
    AuthenticationModule,
    RouterModule.forChild(routes),
    CoreModule
  ],
  exports: [RouterModule]
})
export class SiteModule {
}
