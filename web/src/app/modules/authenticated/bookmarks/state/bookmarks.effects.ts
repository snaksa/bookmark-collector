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
  updateBookmarkTagsFailureAction,
  createBookmarkAction,
  createBookmarkSuccessAction,
  createBookmarkFailureAction,
} from './bookmarks.actions';
import { NotificationService } from '../../../shared/services/notification.service';
import { updateNewLabelsAction } from '../../labels/state/labels.actions';

@Injectable()
export class BookmarksEffects {
  constructor(
    private actions$: Actions,
    private bookmarksService: BookmarksService,
    private notificationService: NotificationService
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
          case BookmarkType.Archived:
            request = this.bookmarksService.getBookmarks(false, true, false);
            break;
          default:
            request = this.bookmarksService.getBookmarks();
        }

        return request.pipe(
          map((bookmarks) => loadBookmarksSuccessAction({ bookmarks, key: action.key })),
          catchError((error) => of(loadBookmarksFailureAction({ error, key: action.key })))
        );
      })
    );
  });

  toggleFavoriteBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(toggleFavoriteBookmarkAction),
      mergeMap((action) => {
        return this.bookmarksService.updateBookmark(action.bookmarkId, { isFavorite: action.isFavorite }).pipe(
          map((bookmark) => {
            const message = bookmark.isFavorite ? 'Bookmark added to Favorites' : 'Bookmark removed from Favorites';
            const icon = bookmark.isFavorite ? 'star' : 'star_border';
            this.notificationService.success({ message, icon });
            return toggleFavoriteBookmarkSuccessAction({ bookmark });
          }),

          catchError((error) => of(toggleFavoriteBookmarkFailureAction({ error })))
        );
      })
    );
  });

  toggleArchiveBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(toggleArchiveBookmarkAction),
      mergeMap((action) => {
        return this.bookmarksService.updateBookmark(action.bookmarkId, { isArchived: action.isArchived }).pipe(
          map((bookmark) => {
            const message = bookmark.isArchived ? 'Bookmark added to Archive' : 'Bookmark removed from Archive';
            const icon = bookmark.isArchived ? 'link_off' : 'cloud_queue';
            this.notificationService.success({ message, icon });
            return toggleArchiveBookmarkSuccessAction({ bookmark });
          }),
          catchError((error) => of(toggleArchiveBookmarkFailureAction({ error })))
        );
      })
    );
  });

  deleteBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteBookmarkAction),
      mergeMap((action) => {
        return this.bookmarksService.deleteBookmark(action.bookmarkId).pipe(
          map(() => {
            this.notificationService.success({ message: 'Bookmark deleted', icon: 'delete_outline' });
            return deleteBookmarkSuccessAction({ bookmarkId: action.bookmarkId });
          }),
          catchError((error) => of(deleteBookmarkFailureAction({ error })))
        );
      })
    );
  });

  createBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createBookmarkAction),
      mergeMap((action) => {
        return this.bookmarksService.createBookmark(action.url).pipe(
          map((bookmark) => {
            this.notificationService.success({ message: 'Bookmark created', icon: 'cloud_queue' });
            return createBookmarkSuccessAction({ bookmark });
          }),
          catchError((error) => of(createBookmarkFailureAction({ error })))
        );
      })
    );
  });

  updateBookmarkTags$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateBookmarkTagsAction),
      mergeMap((action) => {
        return this.bookmarksService
          .updateBookmark(action.bookmarkId, {
            labelIds: action.labelIds,
            newLabels: action.newLabels,
          })
          .pipe(
            mergeMap((bookmark) => {
              this.notificationService.success({ message: 'Bookmark updated', icon: 'cloud_queue' });
              return [
                updateNewLabelsAction({labels: bookmark.labels}),
                updateBookmarkTagsSuccessAction({ bookmark })
              ];
            }),
            catchError((error) => of(updateBookmarkTagsFailureAction({ error })))
          );
      })
    );
  });
}
