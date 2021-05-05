import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Typography } from "@material-ui/core";
import useHttpGet from "../../../../hooks/useHttpGet";
import { useDispatch, useSelector } from "react-redux";
import {
  initializedLabelsDetails,
  initializeLabelsDetails,
} from "../../../../redux/labels/labels.actions";
import BookmarksList from "../../../organisms/bookmarks-list/bookmarks-list/bookmarks-list";

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

  return (
    <Container>
      <Typography variant={"h4"}>
        {labelDetails.isLoading ? "Loading..." : labelDetails.data.title}
      </Typography>
      {!labelDetails.isLoading && (
        <BookmarksList
          bookmarks={labelDetails.data.bookmarks ?? []}
          onDelete={() => {}}
          onFavoriteUpdate={() => {}}
          onArchivedUpdate={() => {}}
        />
      )}
    </Container>
  );
}
