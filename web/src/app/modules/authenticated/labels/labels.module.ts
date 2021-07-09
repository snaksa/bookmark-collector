import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { labelsReducer } from './state/labels.reducer';
import { LabelsEffects } from './state/labels.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    StoreModule.forFeature('labels', labelsReducer),
    EffectsModule.forFeature([LabelsEffects]),
  ],
})
export class LabelsModule {}
