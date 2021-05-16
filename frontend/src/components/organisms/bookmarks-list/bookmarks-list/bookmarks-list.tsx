import React, { useEffect } from "react";
import { Grid, TextField } from "@material-ui/core";
import BookmarkView from "../bookmark-view/boomark-view";
import useStyle from "./styles";
import { Autocomplete } from "@material-ui/lab";
import useHttpGet from "../../../../hooks/useHttpGet";
import { useDispatch, useSelector } from "react-redux";
import {
  initializedLabels,
  initializeLabels,
} from "../../../../redux/labels/labels.actions";
import Dialog from "../../dialog/dialog";
import useHttpPut from "../../../../hooks/useHttpPut";
import { updateBookmark } from "../../../../redux/bookmarks/bookmarks.actions";

export default function BookmarksList({
  bookmarks,
  onDelete,
  onFavoriteUpdate,
  onArchivedUpdate,
}: any) {
  const classes = useStyle();

  const dispatch = useDispatch();
  const labels = useSelector((state: any) => state.labels.list);

  const { fetch: fetchBookmark } = useHttpGet("bookmarks", {}, true);
  const { fetch: fetchLabels } = useHttpGet("labels", {}, true);
  const { execute: updateBookmarkRequest } = useHttpPut();

  const [open, setOpen] = React.useState(false);
  const [bookmarkId, setBookmarkId] = React.useState("");
  const [bookmarkLabels, setBookmarkLabels] = React.useState([]);
  const [selectedLabels, setSelectedLabels] = React.useState<any>([]);

  const handleClickOpen = (bookmarkId: string) => {
    setBookmarkId(bookmarkId);
    fetchBookmark(`bookmarks/${bookmarkId}`).then((data: any) => {
      setBookmarkLabels(data.labels);
      setSelectedLabels(data.labels);
      setOpen(true);
    });
  };
  const handleClose = () => {
    setOpen(false);
  };
  const saveBookmark = () => {
    setOpen(false);
    const labelIds = selectedLabels.map((label: any) => label.id);
    updateBookmarkRequest(`bookmarks/${bookmarkId}`, { labelIds }).then(
      (data) => {
        dispatch(updateBookmark(data));
      }
    );
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
        {bookmarks.map((bookmark: any) => (
          <Grid item key={bookmark.id} classes={{ item: classes.listItem }}>
            <BookmarkView
              bookmark={bookmark}
              onDelete={onDelete}
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
          getOptionLabel={(option: any) => option.title}
          defaultValue={bookmarkLabels}
          filterSelectedOptions={true}
          getOptionSelected={(option: any, value: any) =>
            option.id === value.id
          }
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
    </>
  );
}
