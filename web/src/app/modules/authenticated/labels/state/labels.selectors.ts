import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LabelsState } from './labels.state';

const labelsFeature = createFeatureSelector<LabelsState>('labels');

export const getLabelsSelector = createSelector(
  labelsFeature,
  (state) => state
);
