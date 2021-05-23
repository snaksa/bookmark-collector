import React, { useEffect } from "react";
import { Box, Container, Typography } from "@material-ui/core";
import useHttpGet from "../../../../hooks/useHttpGet";
import BookmarksList from "../../../organisms/bookmarks-list/bookmarks-list/bookmarks-list";
import useFavoriteBookmarkUpdate from "../../../../hooks/useFavoriteBookmarkUpdate";
import {
  initializeBookmarks,
  initializedBookmarks,
} from "../../../../redux/slices/bookmarks.slice";
import useArchiveBookmarkUpdate from "../../../../hooks/useArchiveBookmarkUpdate";
import useDeleteBookmark from "../../../../hooks/useDeleteBookmark";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux-hooks";

export default function MyListScreen(): JSX.Element {
  const dispatch = useAppDispatch();
  const myList = useAppSelector((state) => state.bookmarks.myList);

  const { fetch: fetchBookmarks } = useHttpGet(
    "bookmarks",
    { excludeArchived: 1 },
    true
  );

  useEffect(() => {
    if (!myList.data.length || !myList.initialized) {
      dispatch(initializeBookmarks());
      fetchBookmarks().then((data) => {
        dispatch(initializedBookmarks(data));
      });
    }
  }, []);

  const updateFavoriteStatus = useFavoriteBookmarkUpdate();
  const updateArchiveStatus = useArchiveBookmarkUpdate();
  const deleteBookmark = useDeleteBookmark();

  return (
    <Container>
      <Typography variant={"h4"}>My List</Typography>
      {myList.isLoading ? (
        <Box>Loading...</Box>
      ) : (
        <BookmarksList
          bookmarks={myList.data}
          onDelete={deleteBookmark}
          onFavoriteUpdate={updateFavoriteStatus}
          onArchivedUpdate={updateArchiveStatus}
        />
      )}
    </Container>
  );
}
