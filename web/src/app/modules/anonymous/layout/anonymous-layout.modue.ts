import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnonymousLayoutComponent } from './anonymous-layout.component';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [AnonymousLayoutComponent],
  imports: [CommonModule, RouterModule, CoreModule],
  exports: [AnonymousLayoutComponent],
})
export class AnonymousLayoutModule {}
