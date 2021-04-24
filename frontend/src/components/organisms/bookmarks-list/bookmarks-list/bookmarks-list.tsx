import {Grid} from "@material-ui/core";
import BookmarkView from "../bookmark-view/boomark-view";
import useStyle from './styles';

export default function BookmarksList({bookmarks, onDelete}: any) {
  const classes = useStyle();
  return <Grid>
    {
      bookmarks.map((bookmark: any) => <Grid item key={bookmark.id} className={classes.listItem}>
        <BookmarkView bookmark={bookmark} onDelete={onDelete} />
      </Grid>)
    }
  </Grid>;
}