import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {BookmarksService} from '../services/bookmarks.service';
import {BookmarkType} from './bookmark-type.enum';
import {
  loadBookmarksAction,
  loadBookmarksFailureAction,
  loadBookmarksSuccessAction,
  toggleArchiveBookmarkAction,
  toggleArchiveBookmarkFailureAction,
  toggleArchiveBookmarkSuccessAction,
  deleteBookmarkAction,
  deleteBookmarkFailureAction,
  deleteBookmarkSuccessAction,
  toggleFavoriteBookmarkAction,
  toggleFavoriteBookmarkFailureAction,
  toggleFavoriteBookmarkSuccessAction,
  updateBookmarkTagsAction,
  updateBookmarkTagsSuccessAction,
  updateBookmarkTagsFailureAction, createBookmarkAction, createBookmarkSuccessAction, createBookmarkFailureAction,
} from './bookmarks.actions';

@Injectable()
export class BookmarksEffects {
  constructor(
    private actions$: Actions,
    private bookmarksService: BookmarksService
  ) {
  }

  loadBookmarks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadBookmarksAction),
      mergeMap((action) => {
        let request;
        switch (action.key) {
          case BookmarkType.Favorites:
            request = this.bookmarksService.getBookmarks(true, false, false);
            break;
          case BookmarkType.Archived:
            request = this.bookmarksService.getBookmarks(false, true, false);
            break;
          default:
            request = this.bookmarksService.getBookmarks();
        }

        return request.pipe(
          map((bookmarks) =>
            loadBookmarksSuccessAction({bookmarks, key: action.key})
          ),
          catchError((error) =>
            of(loadBookmarksFailureAction({error, key: action.key}))
          )
        );
      })
    );
  });

  toggleFavoriteBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(toggleFavoriteBookmarkAction),
      mergeMap((action) => {
        return this.bookmarksService.updateBookmark(action.bookmarkId, {isFavorite: action.isFavorite}).pipe(
          map((bookmark) =>
            toggleFavoriteBookmarkSuccessAction({bookmark})
          ),
          catchError((error) =>
            of(toggleFavoriteBookmarkFailureAction({error}))
          )
        );
      })
    );
  });

  toggleArchiveBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(toggleArchiveBookmarkAction),
      mergeMap((action) => {
        return this.bookmarksService.updateBookmark(action.bookmarkId, {isArchived: action.isArchived}).pipe(
          map((bookmark) =>
            toggleArchiveBookmarkSuccessAction({bookmark})
          ),
          catchError((error) =>
            of(toggleArchiveBookmarkFailureAction({error}))
          )
        );
      })
    );
  });

  deleteBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteBookmarkAction),
      mergeMap((action) => {
        return this.bookmarksService.deleteBookmark(action.bookmarkId).pipe(
          map(() =>
            deleteBookmarkSuccessAction({bookmarkId: action.bookmarkId})
          ),
          catchError((error) =>
            of(deleteBookmarkFailureAction({error}))
          )
        );
      })
    );
  });

  createBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createBookmarkAction),
      mergeMap((action) => {
        return this.bookmarksService.createBookmark(action.url).pipe(
          map((bookmark) =>
            createBookmarkSuccessAction({bookmark})
          ),
          catchError((error) =>
            of(createBookmarkFailureAction({error}))
          )
        );
      })
    );
  });

  updateBookmarkTags$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateBookmarkTagsAction),
      mergeMap((action) => {
        return this.bookmarksService.updateBookmark(action.bookmarkId, {
          labelIds: action.labelIds,
          newLabels: action.newLabels
        }).pipe(
          map((bookmark) =>
            updateBookmarkTagsSuccessAction({bookmark})
          ),
          catchError((error) =>
            of(updateBookmarkTagsFailureAction({error}))
          )
        );
      })
    );
  });
}
