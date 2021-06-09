import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography } from "@material-ui/core";
import {
  deleteLabelsDetailsBookmark,
  updateLabelsDetailsBookmark,
} from "../../../../redux/slices/labels/labels.slice";
import BookmarksList from "../../../organisms/bookmarks-list/bookmarks-list/bookmarks-list";
import useFavoriteBookmarkUpdate from "../../../../hooks/useFavoriteBookmarkUpdate";
import useArchiveBookmarkUpdate from "../../../../hooks/useArchiveBookmarkUpdate";
import useDeleteBookmark from "../../../../hooks/useDeleteBookmark";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux-hooks";
import { fetchLabelDetails } from "../../../../redux/slices/labels/thunks/fetchLabelDetails.thunk";

export default function SingleTagScreen(): JSX.Element {
  const { id } = useParams<{ id: string }>();

  const dispatch = useAppDispatch();
  const labelDetails = useAppSelector((state) => state.labels.details);

  const updateFavoriteStatus = useFavoriteBookmarkUpdate();
  const updateArchiveStatus = useArchiveBookmarkUpdate();
  const deleteBookmark = useDeleteBookmark();

  useEffect(() => {
    dispatch(fetchLabelDetails(id));
  }, []);

  return (
    <Container>
      <Typography variant={"h4"}>
        {labelDetails.isLoading ? "Loading..." : labelDetails.data.title}
      </Typography>
      {!labelDetails.isLoading && (
        <BookmarksList
          bookmarks={labelDetails.data.bookmarks ?? []}
          onDelete={(bookmarkId: string) => {
            deleteBookmark(bookmarkId);
            dispatch(deleteLabelsDetailsBookmark(bookmarkId));
          }}
          onFavoriteUpdate={(bookmarkId: string, isFavorite: boolean) => {
            updateFavoriteStatus(bookmarkId, isFavorite);
            dispatch(
              updateLabelsDetailsBookmark({ bookmarkId, data: { isFavorite } })
            );
          }}
          onArchivedUpdate={(bookmarkId: string, isArchived: boolean) => {
            updateArchiveStatus(bookmarkId, isArchived);
            dispatch(
              updateLabelsDetailsBookmark({ bookmarkId, data: { isArchived } })
            );
          }}
        />
      )}
    </Container>
  );
}
