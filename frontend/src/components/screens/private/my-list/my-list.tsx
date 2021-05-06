import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Container, Typography } from "@material-ui/core";
import useHttpGet from "../../../../hooks/useHttpGet";
import BookmarksList from "../../../organisms/bookmarks-list/bookmarks-list/bookmarks-list";
import useFavoriteBookmarkUpdate from "../../../../hooks/useFavoriteBookmarkUpdate";
import {
  initializeBookmarks,
  initializedBookmarks,
} from "../../../../redux/bookmarks/bookmarks.actions";
import useArchiveBookmarkUpdate from "../../../../hooks/useArchiveBookmarkUpdate";
import useDeleteBookmark from "../../../../hooks/useDeleteBookmark";

export default function MyListScreen() {
  const dispatch = useDispatch();
  const myList = useSelector((state: any) => state.bookmarks.myList);

  const { fetch: fetchBookmarks } = useHttpGet(
    "bookmarks",
    { excludeArchived: 1 },
    true
  );

  useEffect(() => {
    if (!myList || !myList.initialized) {
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
