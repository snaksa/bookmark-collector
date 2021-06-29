import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { BookmarksService } from '../services/bookmarks.service';
import { BookmarkType } from './bookmark-type.enum';
import {
  loadBookmarksAction,
  loadBookmarksFailureAction,
  loadBookmarksSuccessAction,
} from './bookmarks.actions';

@Injectable()
export class BookmarksEffects {
  constructor(
    private actions$: Actions,
    private bookmarksService: BookmarksService
  ) {}

  loadBookmarks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadBookmarksAction),
      mergeMap((action) => {
        let request;
        switch (action.key) {
          case BookmarkType.Favorites:
            request = this.bookmarksService.getBookmarks(true, false, false);
            break;
          case BookmarkType.Archvied:
            request = this.bookmarksService.getBookmarks(false, true, false);
            break;
          default:
            request = this.bookmarksService.getBookmarks();
        }

        return request.pipe(
          map((bookmarks) =>
            loadBookmarksSuccessAction({ bookmarks, key: action.key })
          ),
          catchError((error) =>
            of(loadBookmarksFailureAction({ error, key: action.key }))
          )
        );
      })
    );
  });
}
