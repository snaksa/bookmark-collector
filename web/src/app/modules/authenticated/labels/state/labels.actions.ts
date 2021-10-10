import { createAction, props } from '@ngrx/store';
import { Label } from '../../../shared/models/label.model';

export const loadLabelsAction = createAction('[Labels API] Load List');
export const loadLabelsSuccessAction = createAction('[Labels API] Load List Success', props<{ labels: Label[] }>());
export const loadLabelsFailureAction = createAction('[Labels API] Load List Failure', props<{ error: string }>());

export const deleteLabelAction = createAction('[Labels API] Delete Label', props<{ id: string }>());
export const deleteLabelSuccessAction = createAction('[Labels API] Delete Label Success', props<{ id: string }>());
export const deleteLabelFailureAction = createAction('[Labels API] Delete Label Failure', props<{ error: string }>());

export const updateNewLabelsAction = createAction('[Labels API] Update New', props<{ labels: Label[] }>());
