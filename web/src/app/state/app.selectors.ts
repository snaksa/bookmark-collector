import {createFeatureSelector, createSelector} from "@ngrx/store";
import {AppState} from "./app.state";

const labelsFeature =
  createFeatureSelector<AppState>('labels');


export const getLabelsSelector = createSelector(
  labelsFeature,
  (state) => state.labels,
);
