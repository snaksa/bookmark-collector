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

export default function BookmarksList({
  bookmarks,
  onDelete,
  onFavoriteUpdate,
  onArchivedUpdate,
}: any) {
  const classes = useStyle();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (bookmarkId: string) => {
    // TODO: fetch bookmark details
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const saveBookmark = () => {
    setOpen(false);
    console.log("save passed labels");
  };

  const { fetch: fetchLabels } = useHttpGet("labels", {}, true);

  const dispatch = useDispatch();
  const labels = useSelector((state: any) => state.labels.list);

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
          <Grid item key={bookmark.id} className={classes.listItem}>
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
          id="tags-outlined"
          disabled={labels.isLoading}
          options={labels.data}
          getOptionLabel={(option: any) => option.title}
          //defaultValue={[labels[1]]}
          filterSelectedOptions={true}
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
