import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography } from "@material-ui/core";
import useHttpGet from "../../../../hooks/useHttpGet";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteLabelsDetailsBookmark,
  initializedLabelsDetails,
  initializeLabelsDetails,
  updateLabelsDetailsBookmark,
} from "../../../../redux/labels/labels.actions";
import BookmarksList from "../../../organisms/bookmarks-list/bookmarks-list/bookmarks-list";
import useFavoriteBookmarkUpdate from "../../../../hooks/useFavoriteBookmarkUpdate";
import useArchiveBookmarkUpdate from "../../../../hooks/useArchiveBookmarkUpdate";
import useDeleteBookmark from "../../../../hooks/useDeleteBookmark";

export default function SingleTagScreen() {
  const { fetch: fetchLabelDetails } = useHttpGet("labels", {}, true);
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch();
  const labelDetails = useSelector((state: any) => state.labels.details);
  console.log(labelDetails);

  useEffect(() => {
    dispatch(initializeLabelsDetails());
    fetchLabelDetails(`labels/${id}`).then((data) => {
      dispatch(initializedLabelsDetails(data));
    });
  }, []);

  const updateFavoriteStatus = useFavoriteBookmarkUpdate();
  const updateArchiveStatus = useArchiveBookmarkUpdate();
  const deleteBookmark = useDeleteBookmark();

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
            dispatch(updateLabelsDetailsBookmark(bookmarkId, { isFavorite }));
          }}
          onArchivedUpdate={(bookmarkId: string, isArchived: boolean) => {
            updateArchiveStatus(bookmarkId, isArchived);
            dispatch(updateLabelsDetailsBookmark(bookmarkId, { isArchived }));
          }}
        />
      )}
    </Container>
  );
}
