import React, { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import BookmarkView from "../bookmark-view/boomark-view";
import useStyle from "./styles";
import { Autocomplete } from "@material-ui/lab";
import useHttpGet from "../../../../hooks/useHttpGet";
import { useDispatch, useSelector } from "react-redux";
import {
  initializedLabels,
  initializeLabels,
} from "../../../../redux/labels/labels.actions";

export default function BookmarksList({
  bookmarks,
  onDelete,
  onFavoriteUpdate,
  onArchivedUpdate,
}: any) {
  const classes = useStyle();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (bookmarkId: string) => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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
        fullWidth={true}
        maxWidth="sm"
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title">Add Tags</DialogTitle>
        <DialogContent dividers>
          <Autocomplete
            multiple
            id="tags-outlined"
            disabled={labels.isLoading}
            options={labels.data}
            getOptionLabel={(option: any) => option.title}
            //defaultValue={[labels[1]]}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField {...params} variant="outlined" placeholder="Tags" />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
