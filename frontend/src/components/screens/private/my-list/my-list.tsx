import React, {useEffect} from 'react';
import {Box, Container, Typography} from "@material-ui/core";
import useHttpGet from "../../../../hooks/useHttpGet";
import BookmarksList from "../../../organisms/bookmarks-list/bookmarks-list/bookmarks-list";
import useHttpDelete from "../../../../hooks/useHttpDelete";
import {useBookmarks} from "../../../../hooks/useBookmarks";
import useHttpPut from "../../../../hooks/useHttpPut";

export default function MyListScreen() {
    const {isLoading: bookmarksLoading, fetch: fetchBookmarks} = useHttpGet('bookmarks', {excludeArchived: 1}, true);
    const {deleteAction} = useHttpDelete();
    const {execute: updateBookmark} = useHttpPut();

    const {bookmarks, addBookmarks, replaceBookmark, removeBookmarks} = useBookmarks();

    useEffect(() => {
        fetchBookmarks().then(data => {
            addBookmarks(data);
        });
    }, []);

    const onFavoriteUpdate = (bookmarkId: string, isFavorite: boolean) => {
        updateBookmark(`bookmarks/${bookmarkId}`, {isFavorite: isFavorite}).then((data) => {
            replaceBookmark(data);
        });
    }

    const onArchivedUpdate = (bookmarkId: string, isArchived: boolean) => {
        updateBookmark(`bookmarks/${bookmarkId}`, {isArchived: isArchived}).then((data) => {
            removeBookmarks([data]);
        });
    }

    const onDelete = (bookmark: any) => {
        deleteAction(`bookmarks/${bookmark.id}`).then((response) => {
            removeBookmarks([bookmark]);
        });
    }

    return <Container>
        <Typography variant={'h4'}>My List</Typography>
        {bookmarksLoading ? <Box>Loading...</Box> : <BookmarksList bookmarks={bookmarks} onDelete={onDelete} onFavoriteUpdate={onFavoriteUpdate} onArchivedUpdate={onArchivedUpdate} />}
    </Container>;

}