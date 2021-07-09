import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApplicationState } from './app.state';

const appFeature = createFeatureSelector<ApplicationState>('app');

export const getCurrentUserSelector = createSelector(appFeature, (state) => state.currentUser);
