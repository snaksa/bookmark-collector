import React from "react";
import { Chip, Grid, IconButton } from "@material-ui/core";
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
  return (
    <Grid container direction="row">
      <Grid item md={9} lg={9}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <a
              rel="noreferrer"
              href={bookmark.url}
              target="_blank"
              className={classes.title}
            >
              {bookmark.url}
            </a>
          </Grid>
          <Grid item>
            <Grid container direction="row" spacing={2}>
              {bookmark.labels.map((label) => (
                <Grid item key={label.id}>
                  <Chip key={label.id} size="small" label={label.title} />
                </Grid>
              ))}
            </Grid>
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
