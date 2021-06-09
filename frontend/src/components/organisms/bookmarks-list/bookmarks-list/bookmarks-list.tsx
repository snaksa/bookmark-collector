import React, { useEffect } from "react";
import { Grid, TextField } from "@material-ui/core";
import BookmarkView from "../bookmark-view/boomark-view";
import useStyle from "./styles";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import Dialog from "../../dialog/dialog";
import { updateBookmark } from "../../../../redux/slices/bookmarks/thunks";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux-hooks";
import { Label } from "../../../../models/label.model";
import { fetchLabels } from "../../../../redux/slices/labels/thunks/fetchLabels.thunk";
import { fetchBookmarkDetails } from "../../../../redux/slices/bookmarks/thunks/fetchBookmarkDetails.thunk";
import { Bookmark } from "../../../../models/bookmark.model";

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

  const [open, setOpen] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [bookmarkId, setBookmarkId] = React.useState("");
  const [bookmarkLabels, setBookmarkLabels] = React.useState<Label[]>([]);
  const [selectedLabels, setSelectedLabels] = React.useState<Label[]>([]);

  const handleClickOpen = (bookmarkId: string) => {
    setBookmarkId(bookmarkId);
    dispatch(fetchBookmarkDetails(bookmarkId)).then((data) => {
      if (fetchBookmarkDetails.fulfilled.match(data)) {
        setBookmarkLabels(data.payload.labels);
        setSelectedLabels(data.payload.labels);
        setOpen(true);
      }
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
    const labelIds = selectedLabels
      .filter((label) => !label.id.startsWith("new_"))
      .map((label) => label.id);

    const newLabels = selectedLabels
      .filter((label) => label.id.startsWith("new_"))
      .map((label) => label.title);

    dispatch(
      updateBookmark({
        id: bookmarkId,
        labelIds,
        newLabels,
      })
    );
  };

  const deleteBookmark = () => {
    setOpenDeleteDialog(false);
    onDelete(bookmarkId);
  };

  useEffect(() => {
    if (!labels || !labels.initialized) {
      dispatch(fetchLabels());
    }
  }, []);

  const filter = createFilterOptions<Label>();

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
          onChange={(event, value: Label[]) => {
            const vals: Label[] = value
              .map((v) => {
                if (v.id === "new") {
                  v.id = `new_${Date.now()}`;

                  const labelExists = selectedLabels.find(
                    (label) =>
                      label.title.toLowerCase() === v.title.toLowerCase()
                  );

                  if (labelExists) {
                    v.id = "";
                  }
                }

                return v;
              })
              .filter((v) => v.id);

            setSelectedLabels(vals);
          }}
          id="tags-outlined"
          disabled={labels.isLoading}
          options={labels.data}
          getOptionLabel={(option) =>
            option.id !== "new" ? option.title : `Add "${option.title}"`
          }
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
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            // Suggest the creation of a new value
            if (params.inputValue !== "" && !filtered.length) {
              filtered.push({
                id: "new",
                color: "red",
                bookmarks: [],
                title: params.inputValue,
              });
            }

            return filtered;
          }}
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
