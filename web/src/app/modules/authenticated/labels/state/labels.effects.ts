import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import {
  loadLabelsAction,
  loadLabelsFailureAction,
  loadLabelsSuccessAction,
} from './labels.actions';
import { LabelsService } from '../services/labels.service';

@Injectable()
export class LabelsEffects {
  constructor(
    private actions$: Actions,
    private labelsService: LabelsService
  ) {}

  loadLabels = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadLabelsAction),
      mergeMap(() => {
        return this.labelsService.getLabels().pipe(
          map((labels) => loadLabelsSuccessAction({ labels })),
          catchError((error) => of(loadLabelsFailureAction({ error })))
        );
      })
    );
  });
}
