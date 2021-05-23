import React, { useEffect } from "react";
import { Box, Container, Typography } from "@material-ui/core";
import useHttpGet from "../../../../hooks/useHttpGet";
import BookmarksList from "../../../organisms/bookmarks-list/bookmarks-list/bookmarks-list";
import {
  initializeArchivedBookmarks,
  initializedArchivedBookmarks,
} from "../../../../redux/slices/bookmarks.slice";
import useFavoriteBookmarkUpdate from "../../../../hooks/useFavoriteBookmarkUpdate";
import useArchiveBookmarkUpdate from "../../../../hooks/useArchiveBookmarkUpdate";
import useDeleteBookmark from "../../../../hooks/useDeleteBookmark";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux-hooks";

export default function ArchivedScreen(): JSX.Element {
  const { fetch: fetchBookmarks } = useHttpGet(
    "bookmarks",
    { archived: 1 },
    true
  );

  const dispatch = useAppDispatch();
  const archived = useAppSelector((state) => state.bookmarks.archived);

  useEffect(() => {
    if (!archived.data.length || !archived.initialized) {
      dispatch(initializeArchivedBookmarks());
      fetchBookmarks().then((data) => {
        dispatch(initializedArchivedBookmarks(data));
      });
    }
  }, []);

  const updateFavoriteStatus = useFavoriteBookmarkUpdate();
  const updateArchiveStatus = useArchiveBookmarkUpdate();
  const deleteBookmark = useDeleteBookmark();

  return (
    <Container>
      <Typography variant={"h4"}>Archived</Typography>
      {archived.isLoading ? (
        <Box>Loading...</Box>
      ) : (
        <BookmarksList
          bookmarks={archived.data}
          onFavoriteUpdate={updateFavoriteStatus}
          onArchivedUpdate={updateArchiveStatus}
          onDelete={deleteBookmark}
        />
      )}
    </Container>
  );
}
