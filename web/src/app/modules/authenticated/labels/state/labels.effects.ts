import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import {
  deleteLabelAction,
  deleteLabelFailureAction,
  deleteLabelSuccessAction,
  loadLabelsAction,
  loadLabelsFailureAction,
  loadLabelsSuccessAction, updateLabelAction, updateLabelSuccessAction
} from './labels.actions';
import { LabelsService } from '../services/labels.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Router } from '@angular/router';
import { Label } from '../../../shared/models/label.model';

@Injectable()
export class LabelsEffects {
  constructor(
    private actions$: Actions,
    private labelsService: LabelsService,
    private notificationService: NotificationService,
    private router: Router
  ) {
  }

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

  deleteLabel = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteLabelAction),
      mergeMap((action) => {
        return this.labelsService.deleteLabel(action.id).pipe(
          map((id) => {
            this.notificationService.success({ message: 'Label deleted', icon: 'delete_outline' });
            this.router.navigateByUrl('bookmarks/my-list');
            return deleteLabelSuccessAction({ id });
          }),
          catchError((error) => of(deleteLabelFailureAction({ error })))
        );
      })
    );
  });

  updateLabel = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateLabelAction),
      mergeMap((action) => {
        return this.labelsService.updateLabel(action.id, action.title).pipe(
          map((label: Label) => {
            this.notificationService.success({ message: 'Tag updated', icon: 'cloud_queue' });
            return updateLabelSuccessAction(label);
          }),
          catchError((error) => of(deleteLabelFailureAction({ error })))
        );
      })
    );
  });
}
