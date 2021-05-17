import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography } from "@material-ui/core";
import useHttpGet from "../../../../hooks/useHttpGet";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteLabelsDetailsBookmark,
  initializedLabelsDetails,
  initializeLabelsDetails,
  updateLabelsDetailsBookmark,
} from "../../../../redux/slices/labelsSlice";
import BookmarksList from "../../../organisms/bookmarks-list/bookmarks-list/bookmarks-list";
import useFavoriteBookmarkUpdate from "../../../../hooks/useFavoriteBookmarkUpdate";
import useArchiveBookmarkUpdate from "../../../../hooks/useArchiveBookmarkUpdate";
import useDeleteBookmark from "../../../../hooks/useDeleteBookmark";

export default function SingleTagScreen() {
  const { id } = useParams<{ id: string }>();

  const { fetch: fetchLabelDetails } = useHttpGet("labels", {}, true);

  const dispatch = useDispatch();
  const labelDetails = useSelector((state: any) => state.labels.details);

  const updateFavoriteStatus = useFavoriteBookmarkUpdate();
  const updateArchiveStatus = useArchiveBookmarkUpdate();
  const deleteBookmark = useDeleteBookmark();

  useEffect(() => {
    dispatch(initializeLabelsDetails());
    fetchLabelDetails(`labels/${id}`).then((data) => {
      dispatch(initializedLabelsDetails(data));
    });
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
