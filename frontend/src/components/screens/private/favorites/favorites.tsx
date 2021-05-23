import React, { useEffect } from "react";
import { Box, Container, Typography } from "@material-ui/core";
import useHttpGet from "../../../../hooks/useHttpGet";
import BookmarksList from "../../../organisms/bookmarks-list/bookmarks-list/bookmarks-list";
import { useDispatch, useSelector } from "react-redux";
import {
  initializedFavoriteBookmarks,
  initializeFavoriteBookmarks,
} from "../../../../redux/slices/bookmarks.slice";
import useFavoriteBookmarkUpdate from "../../../../hooks/useFavoriteBookmarkUpdate";
import useArchiveBookmarkUpdate from "../../../../hooks/useArchiveBookmarkUpdate";
import useDeleteBookmark from "../../../../hooks/useDeleteBookmark";

export default function FavoritesScreen() {
  const dispatch = useDispatch();
  const favorites = useSelector((state: any) => state.bookmarks.favorites);

  const { fetch: fetchBookmarks } = useHttpGet(
    "bookmarks",
    { favorites: 1 },
    true
  );

  useEffect(() => {
    if (!favorites.data.length || !favorites.initialized) {
      dispatch(initializeFavoriteBookmarks());
      fetchBookmarks().then((data) => {
        dispatch(initializedFavoriteBookmarks(data));
      });
    }
  }, []);

  const updateFavoriteStatus = useFavoriteBookmarkUpdate();
  const updateArchiveStatus = useArchiveBookmarkUpdate();
  const deleteBookmark = useDeleteBookmark();

  return (
    <Container>
      <Typography variant={"h4"}>Favorites</Typography>
      {favorites.isLoading ? (
        <Box>Loading...</Box>
      ) : (
        <BookmarksList
          bookmarks={favorites.data}
          onFavoriteUpdate={updateFavoriteStatus}
          onArchivedUpdate={updateArchiveStatus}
          onDelete={deleteBookmark}
        />
      )}
    </Container>
  );
}
