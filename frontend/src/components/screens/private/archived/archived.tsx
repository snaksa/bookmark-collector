import React from 'react';
import {Box, Container, Typography} from "@material-ui/core";
import useHttpGet from "../../../../hooks/useHttpGet";
import BookmarksList from "../../../organisms/bookmarks-list/bookmarks-list/bookmarks-list";
import useHttpDelete from "../../../../hooks/useHttpDelete";
import useHttpPut from "../../../../hooks/useHttpPut";
import {useBookmarks} from "../../../../hooks/useBookmarks";

export default function ArchivedScreen() {
    const {isLoading: bookmarksLoading, response: bookmarks, fetch: fetchBookmarks} = useHttpGet('bookmarks', {archived: 1});
    const {deleteAction} = useHttpDelete();
    const {execute: updateBookmark} = useHttpPut();

    const {addBookmarks} = useBookmarks();

    const onFavoriteUpdate = (bookmarkId: string, isFavorite: boolean) => {
        updateBookmark(`bookmarks/${bookmarkId}`, {isFavorite: isFavorite}).then((data) => {
            fetchBookmarks();
        });
    }

    const onDelete = (bookmark: any) => {
        deleteAction(`bookmarks/${bookmark.id}`).then((response) => {
            fetchBookmarks();
        });
    }

    const onArchivedUpdate = (bookmarkId: string, isArchived: boolean) => {
        updateBookmark(`bookmarks/${bookmarkId}`, {isArchived: isArchived}).then((data) => {
            addBookmarks([data]);
            fetchBookmarks();
        });
    }

    return <Container>
        <Typography variant={'h4'}>Archived</Typography>
        {bookmarksLoading ? <Box>Loading...</Box> : <BookmarksList bookmarks={bookmarks} onDelete={onDelete} onFavoriteUpdate={onFavoriteUpdate} onArchivedUpdate={onArchivedUpdate} />}
    </Container>;

}