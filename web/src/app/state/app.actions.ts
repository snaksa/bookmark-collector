import { createAction, props } from '@ngrx/store';
import { User } from '../modules/shared/models/user.model';

export const loadUserAction = createAction('[Users API] Load Current User');
export const loadUserSuccessAction = createAction('[Users API] Load Current User Success', props<{ user: User }>());
export const loadUserFailureAction = createAction('[Users API] Load Current User Failure', props<{ error: string }>());

export const updateUserAction = createAction(
  '[Users API] Update Current User',
  props<{ firstName: string; lastName: string; email: string }>()
);
export const updateUserSuccessAction = createAction('[Users API] Update Current User Success', props<{ user: User }>());
export const updateUserFailureAction = createAction(
  '[Users API] Update Current User Failure',
  props<{ error: string }>()
);
