import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../../core/core.module';
import { DialogTitleComponent } from './dialog-title/dialog-title.component';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import { DialogActionsComponent } from './dialog-actions/dialog-actions.component';
import { DialogActionComponent } from './dialog-action/dialog-action.component';
import { DialogContainerComponent } from './dialog-container/dialog-container.component';

@NgModule({
  declarations: [
    DialogTitleComponent,
    DialogContentComponent,
    DialogActionsComponent,
    DialogActionComponent,
    DialogContainerComponent,
  ],
  imports: [CommonModule, CoreModule],
  exports: [
    DialogTitleComponent,
    DialogContentComponent,
    DialogActionsComponent,
    DialogActionComponent,
    DialogContainerComponent,
  ],
})
export class DialogModule {}
