import React, { useEffect } from "react";
import { Box, Container, Typography } from "@material-ui/core";
import useHttpGet from "../../../../hooks/useHttpGet";
import BookmarksList from "../../../organisms/bookmarks-list/bookmarks-list/bookmarks-list";
import {
  initializeArchivedBookmarks,
  initializedArchivedBookmarks,
} from "../../../../redux/bookmarks/bookmarks.actions";
import { useDispatch, useSelector } from "react-redux";
import useFavoriteBookmarkUpdate from "../../../../hooks/useFavoriteBookmarkUpdate";
import useArchiveBookmarkUpdate from "../../../../hooks/useArchiveBookmarkUpdate";
import useDeleteBookmark from "../../../../hooks/useDeleteBookmark";

export default function ArchivedScreen() {
  const { fetch: fetchBookmarks } = useHttpGet(
    "bookmarks",
    { archived: 1 },
    true
  );

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
