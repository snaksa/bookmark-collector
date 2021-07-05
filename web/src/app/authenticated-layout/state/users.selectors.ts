import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './users.state';

const usersFeature = createFeatureSelector<UsersState>('users');

export const getCurrentUserSelector = createSelector(usersFeature, (state) => state.currentUser);
