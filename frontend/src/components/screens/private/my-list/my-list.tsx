import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Box, Container, Typography} from "@material-ui/core";
import useHttpGet from "../../../../hooks/useHttpGet";
import BookmarksList from "../../../organisms/bookmarks-list/bookmarks-list/bookmarks-list";
import useHttpDelete from "../../../../hooks/useHttpDelete";
import useHttpPut from "../../../../hooks/useHttpPut";
import {
    initializeBookmarks,
    initializedBookmarks, deleteBookmark,
    updateBookmark, addToFavoritesBookmark, removeFromFavoritesBookmark
} from "../../../../redux/bookmarks/bookmarks.actions";

export default function MyListScreen() {
    const dispatch = useDispatch();
    const myList = useSelector((state: any) => state.bookmarks.myList);

    const {fetch: fetchBookmarks} = useHttpGet('bookmarks', {excludeArchived: 1}, true);
    const {deleteAction} = useHttpDelete();
    const {execute: updateBookmarkRequest} = useHttpPut();

    useEffect(() => {
        dispatch(initializeBookmarks());
        fetchBookmarks().then(data => {
            dispatch(initializedBookmarks(data));
        });
    }, []);

    const onFavoriteUpdate = (bookmarkId: string, isFavorite: boolean) => {
        updateBookmarkRequest(`bookmarks/${bookmarkId}`, {isFavorite: isFavorite}).then((data) => {
            if(data.isFavorite) {
                dispatch(addToFavoritesBookmark(data));
            } else {
                dispatch(removeFromFavoritesBookmark(data));
            }
        });
    }

    const onArchivedUpdate = (bookmarkId: string, isArchived: boolean) => {
        updateBookmarkRequest(`bookmarks/${bookmarkId}`, {isArchived: isArchived}).then((data) => {
            dispatch(deleteBookmark(bookmarkId));
        });
    }

    const onDelete = (bookmark: any) => {
        deleteAction(`bookmarks/${bookmark.id}`).then((response) => {
            dispatch(deleteBookmark(bookmark.id));
        });
    }

    return <Container>
        <Typography variant={'h4'}>My List</Typography>
        {myList.isLoading
            ? <Box>Loading...</Box>
            : <BookmarksList
                bookmarks={myList.data}
                onDelete={onDelete}
                onFavoriteUpdate={onFavoriteUpdate}
                onArchivedUpdate={onArchivedUpdate}
            />
        }
    </Container>;

}