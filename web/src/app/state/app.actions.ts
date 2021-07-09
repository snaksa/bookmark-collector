import { createAction, props } from '@ngrx/store';
import { User } from '../modules/shared/models/user.model';

export const loadUserAction = createAction('[Users API] Load Current User');
export const loadUserSuccessAction = createAction('[Users API] Load Current User Success', props<{ user: User }>());
export const loadUserFailureAction = createAction('[Users API] Load Current User Failure', props<{ error: string }>());
