import React, { useEffect } from "react";
import { Grid, TextField } from "@material-ui/core";
import BookmarkView from "../bookmark-view/boomark-view";
import useStyle from "./styles";
import { Autocomplete } from "@material-ui/lab";
import useHttpGet from "../../../../hooks/useHttpGet";

import Dialog from "../../dialog/dialog";
import useHttpPut from "../../../../hooks/useHttpPut";
import { updateBookmark } from "../../../../redux/slices/bookmarks.slice";
import {
  initializedLabels,
  initializeLabels,
} from "../../../../redux/slices/labels.slice";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux-hooks";
import { Bookmark } from "../../../../models/bookmark.model";
import { Label } from "../../../../models/label.model";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onDelete: (bookmarkId: string) => void;
  onFavoriteUpdate: (bookmarkId: string, isFavorite: boolean) => void;
  onArchivedUpdate: (bookmarkId: string, isArchived: boolean) => void;
}

export default function BookmarksList({
  bookmarks,
  onDelete,
  onFavoriteUpdate,
  onArchivedUpdate,
}: BookmarkListProps): JSX.Element {
  const classes = useStyle();

  const dispatch = useAppDispatch();
  const labels = useAppSelector((state) => state.labels.list);

  const { fetch: fetchBookmark } = useHttpGet("bookmarks", {}, true);
  const { fetch: fetchLabels } = useHttpGet("labels", {}, true);
  const { execute: updateBookmarkRequest } = useHttpPut();

  const [open, setOpen] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [bookmarkId, setBookmarkId] = React.useState("");
  const [bookmarkLabels, setBookmarkLabels] = React.useState<Label[]>([]);
  const [selectedLabels, setSelectedLabels] = React.useState<Label[]>([]);

  const handleClickOpen = (bookmarkId: string) => {
    setBookmarkId(bookmarkId);
    fetchBookmark(`bookmarks/${bookmarkId}`).then((data: Bookmark) => {
      setBookmarkLabels(data.labels);
      setSelectedLabels(data.labels);
      setOpen(true);
    });
  };
  const handleClose = () => {
    setOpen(false);
  };

  const openDeleteModal = (bookmarkId: string) => {
    setBookmarkId(bookmarkId);
    setOpenDeleteDialog(true);
  };
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const saveBookmark = () => {
    setOpen(false);
    const labelIds = selectedLabels.map((label) => label.id);
    updateBookmarkRequest(`bookmarks/${bookmarkId}`, { labelIds }).then(
      (data) => {
        dispatch(updateBookmark(data));
      }
    );
  };

  const deleteBookmark = () => {
    setOpenDeleteDialog(false);
    onDelete(bookmarkId);
  };

  useEffect(() => {
    if (!labels || !labels.initialized) {
      dispatch(initializeLabels());
      fetchLabels().then((data) => {
        dispatch(initializedLabels(data));
      });
    }
  }, []);

  return (
    <>
      <Grid>
        {bookmarks.map((bookmark) => (
          <Grid item key={bookmark.id} classes={{ item: classes.listItem }}>
            <BookmarkView
              bookmark={bookmark}
              onDelete={openDeleteModal}
              onFavoriteUpdate={onFavoriteUpdate}
              onArchivedUpdate={onArchivedUpdate}
              onEditTags={handleClickOpen}
            />
          </Grid>
        ))}
      </Grid>
      <Dialog
        handleClose={handleClose}
        title={"Add Tags"}
        open={open}
        actions={[{ title: "Save", action: saveBookmark }]}
      >
        <Autocomplete
          multiple
          onChange={(event, value) => {
            setSelectedLabels(value);
          }}
          id="tags-outlined"
          disabled={labels.isLoading}
          options={labels.data}
          getOptionLabel={(option) => option.title}
          defaultValue={bookmarkLabels}
          filterSelectedOptions={true}
          getOptionSelected={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              size="small"
              placeholder="Tags"
            />
          )}
        />
      </Dialog>
      <Dialog
        handleClose={handleDeleteDialogClose}
        title={"Delete Item"}
        open={openDeleteDialog}
        actions={[{ title: "Delete", action: deleteBookmark }]}
      >
        Are you sure you want to delete this item? This cannot be undone.
      </Dialog>
    </>
  );
}
