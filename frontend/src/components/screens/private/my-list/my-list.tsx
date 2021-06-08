import React, { useEffect } from "react";
import { Box, Container, Typography } from "@material-ui/core";
import BookmarksList from "../../../organisms/bookmarks-list/bookmarks-list/bookmarks-list";
import useFavoriteBookmarkUpdate from "../../../../hooks/useFavoriteBookmarkUpdate";
import { fetchMyList } from "../../../../redux/slices/bookmarks/thunks/fetchMyList.thunk";
import useArchiveBookmarkUpdate from "../../../../hooks/useArchiveBookmarkUpdate";
import useDeleteBookmark from "../../../../hooks/useDeleteBookmark";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux-hooks";

export default function MyListScreen(): JSX.Element {
  const dispatch = useAppDispatch();
  const myList = useAppSelector((state) => state.bookmarks.myList);

  useEffect(() => {
    if (!myList.data.length || !myList.initialized) {
      dispatch(fetchMyList());
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
