import React from "react";
import { Box, Grid, IconButton, Typography } from "@material-ui/core";
import useStyles from "./styles";
import {
  DeleteOutlined as DeleteIcon,
  StarOutline as StarBorderIcon,
  MoveToInbox as MoveToInboxIcon,
  LocalOfferOutlined as LocalOfferIcon,
  Add as AddIcon,
} from "@material-ui/icons";
import { Bookmark } from "../../../../models/bookmark.model";

interface BookmarkViewProps {
  bookmark: Bookmark;
  onDelete: (bookmarkId: string) => void;
  onFavoriteUpdate: (bookmarkId: string, isFavorite: boolean) => void;
  onArchivedUpdate: (bookmarkId: string, isArchived: boolean) => void;
  onEditTags: (bookmarkId: string) => void;
}

export default function BookmarkView({
  bookmark,
  onDelete,
  onFavoriteUpdate,
  onArchivedUpdate,
  onEditTags,
}: BookmarkViewProps): JSX.Element {
  const classes = useStyles();

  const url = new URL(bookmark.url);

  return (
    <Grid container direction="row" spacing={2}>
      <Grid item md={1} lg={1}>
        {bookmark.image ? (
          <img
            src={bookmark.image}
            alt={"Bookmark image"}
            className={classes.image}
          />
        ) : (
          <Box className={classes.noImage} />
        )}
      </Grid>
      <Grid item md={8} lg={8}>
        <Grid container direction="column" spacing={1}>
          <Grid item md={12}>
            <a
              rel="noreferrer"
              href={bookmark.url}
              target="_blank"
              className={classes.link}
            >
              <Typography noWrap className={classes.title}>
                {bookmark.title ? bookmark.title : bookmark.url}
              </Typography>
            </a>
          </Grid>
          <Grid item>
            <Typography noWrap className={classes.host}>
              <a href={bookmark.url} className={classes.link}>
                {url.host}
              </a>
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={3} lg={3} classes={{ item: classes.actions }}>
        <IconButton
          onClick={() => onFavoriteUpdate(bookmark.id, !bookmark.isFavorite)}
        >
          <StarBorderIcon
            style={{ color: bookmark.isFavorite ? "orange" : "black" }}
          />
        </IconButton>
        <IconButton
          onClick={() => onArchivedUpdate(bookmark.id, !bookmark.isArchived)}
        >
          {bookmark.isArchived ? <AddIcon /> : <MoveToInboxIcon />}
        </IconButton>
        <IconButton onClick={() => onEditTags(bookmark.id)}>
          <LocalOfferIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(bookmark.id)}>
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}
