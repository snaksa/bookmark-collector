import React, { useEffect } from "react";
import { Box, Container, Typography } from "@material-ui/core";
import BookmarksList from "../../../organisms/bookmarks-list/bookmarks-list/bookmarks-list";
import { fetchFavorites } from "../../../../redux/slices/bookmarks/thunks";
import useFavoriteBookmarkUpdate from "../../../../hooks/useFavoriteBookmarkUpdate";
import useArchiveBookmarkUpdate from "../../../../hooks/useArchiveBookmarkUpdate";
import useDeleteBookmark from "../../../../hooks/useDeleteBookmark";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux-hooks";

export default function FavoritesScreen(): JSX.Element {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.bookmarks.favorites);

  useEffect(() => {
    if (!favorites.data.length || !favorites.initialized) {
      dispatch(fetchFavorites());
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
