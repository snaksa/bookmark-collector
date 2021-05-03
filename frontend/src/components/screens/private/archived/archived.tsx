import React, { useEffect } from "react";
import { Box, Container, Typography } from "@material-ui/core";
import useHttpGet from "../../../../hooks/useHttpGet";
import BookmarksList from "../../../organisms/bookmarks-list/bookmarks-list/bookmarks-list";
import useHttpDelete from "../../../../hooks/useHttpDelete";
import useHttpPut from "../../../../hooks/useHttpPut";
import {
  addToArchivedBookmark,
  removeFromArchivedBookmark,
  deleteBookmark,
  initializeArchivedBookmarks,
  initializedArchivedBookmarks,
  addToFavoritesBookmark,
  removeFromFavoritesBookmark,
} from "../../../../redux/bookmarks/bookmarks.actions";
import { useDispatch, useSelector } from "react-redux";

export default function ArchivedScreen() {
  const { fetch: fetchBookmarks } = useHttpGet(
    "bookmarks",
    { archived: 1 },
    true
  );
  const { deleteAction } = useHttpDelete();
  const { execute: updateBookmark } = useHttpPut();

  const dispatch = useDispatch();
  const archived = useSelector((state: any) => state.bookmarks.archived);

  useEffect(() => {
    if (!archived || !archived.initialized) {
      dispatch(initializeArchivedBookmarks());
      fetchBookmarks().then((data) => {
        dispatch(initializedArchivedBookmarks(data));
      });
    }
  }, []);

  const onFavoriteUpdate = (bookmarkId: string, isFavorite: boolean) => {
    updateBookmark(`bookmarks/${bookmarkId}`, { isFavorite: isFavorite }).then(
      (data) => {
        if (isFavorite) {
          dispatch(addToFavoritesBookmark(data));
        } else {
          dispatch(removeFromFavoritesBookmark(data));
        }
      }
    );
  };

  const onDelete = (bookmark: any) => {
    deleteAction(`bookmarks/${bookmark.id}`).then((response) => {
      dispatch(deleteBookmark(bookmark.id));
    });
  };

  const onArchivedUpdate = (bookmarkId: string, isArchived: boolean) => {
    updateBookmark(`bookmarks/${bookmarkId}`, { isArchived: isArchived }).then(
      (data) => {
        if (isArchived) {
          dispatch(addToArchivedBookmark(data));
        } else {
          dispatch(removeFromArchivedBookmark(data));
        }
      }
    );
  };

  return (
    <Container>
      <Typography variant={"h4"}>Archived</Typography>
      {archived.isLoading ? (
        <Box>Loading...</Box>
      ) : (
        <BookmarksList
          bookmarks={archived.data}
          onDelete={onDelete}
          onFavoriteUpdate={onFavoriteUpdate}
          onArchivedUpdate={onArchivedUpdate}
        />
      )}
    </Container>
  );
}
