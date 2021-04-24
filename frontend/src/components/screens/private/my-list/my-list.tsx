import React, {useEffect} from 'react';
import {Box, Container, Typography} from "@material-ui/core";
import useHttpGet from "../../../../hooks/useHttpGet";
import BookmarksList from "../../../organisms/bookmarks-list/bookmarks-list/bookmarks-list";
import useHttpDelete from "../../../../hooks/useHttpDelete";
import {useBookmarks} from "../../../../hooks/useBookmarks";

export default function MyListScreen() {
  const {isLoading: bookmarksLoading, fetch: fetchBookmarks} = useHttpGet('bookmarks', {}, true);
  const {deleteAction} = useHttpDelete();

  const {bookmarks, addBookmarks, removeBookmarks} = useBookmarks();

  useEffect(() => {
    fetchBookmarks().then(data => {
      addBookmarks(data);
    });
  }, []);

  const onDelete = (bookmark: any) => {
    deleteAction(`bookmarks/${bookmark.id}`).then((response) => {
      removeBookmarks([bookmark]);
    });
  }

  return <Container>
    <Typography variant={'h4'}>My List</Typography>
    {bookmarksLoading ? <Box>Loading...</Box> : <BookmarksList bookmarks={bookmarks} onDelete={onDelete} />}
  </Container>;

}