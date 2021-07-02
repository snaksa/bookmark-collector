import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {LabelsService} from "../modules/labels/services/labels.service";
import {loadLabelsAction, loadLabelsFailureAction, loadLabelsSuccessAction} from "./app.actions";

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private labelsService: LabelsService
  ) {
  }

  loadLabels = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadLabelsAction),
      mergeMap(() => {
        return this.labelsService.getLabels().pipe(
          map((labels) =>
            loadLabelsSuccessAction({labels})
          ),
          catchError((error) =>
            of(loadLabelsFailureAction({error}))
          )
        );
      })
    );
  });
}
