import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { labelsReducer } from './state/labels.reducer';
import { LabelsEffects } from './state/labels.effects';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { EditLabelDialogComponent } from './components/edit-label-dialog/edit-label-dialog.component';

@NgModule({
  declarations: [EditLabelDialogComponent],
  imports: [
    CoreModule,
    CommonModule,
    SharedModule,
    StoreModule.forFeature('labels', labelsReducer),
    EffectsModule.forFeature([LabelsEffects])
  ]
})
export class LabelsModule {
}
