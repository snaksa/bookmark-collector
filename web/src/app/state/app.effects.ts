import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AuthService } from '../modules/shared/services/auth.service';
import {
  loadUserAction,
  loadUserFailureAction,
  loadUserSuccessAction,
  updateUserAction,
  updateUserFailureAction,
  updateUserSuccessAction,
} from './app.actions';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  loadCurrentUser = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadUserAction),
      mergeMap((user) => {
        return this.authService.getCurrentUser().pipe(
          map((user) => loadUserSuccessAction({ user })),
          catchError((error) => of(loadUserFailureAction({ error })))
        );
      })
    );
  });

  updateCurrentUser = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateUserAction),
      mergeMap((data) => {
        return this.authService.updateUser(data.firstName, data.lastName, data.email).pipe(
          map((user) => updateUserSuccessAction({ user })),
          catchError((error) => of(updateUserFailureAction({ error })))
        );
      })
    );
  });
}
