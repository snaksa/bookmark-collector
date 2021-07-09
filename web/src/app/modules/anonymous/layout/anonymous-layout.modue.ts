import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnonymousLayoutComponent } from './anonymous-layout.component';

@NgModule({
  declarations: [AnonymousLayoutComponent],
  imports: [CommonModule, RouterModule],
  exports: [AnonymousLayoutComponent],
})
export class AnonymousLayoutModule {}
