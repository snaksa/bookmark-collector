import React, {useEffect} from 'react';
import {Box, Container, Typography} from "@material-ui/core";
import useHttpGet from "../../../../hooks/useHttpGet";
import BookmarksList from "../../../organisms/bookmarks-list/bookmarks-list/bookmarks-list";
import useHttpDelete from "../../../../hooks/useHttpDelete";
import useHttpPut from "../../../../hooks/useHttpPut";
import {useDispatch, useSelector} from "react-redux";
import {
    addToFavoritesBookmark,
    deleteBookmark,
    initializedFavoriteBookmarks,
    initializeFavoriteBookmarks, removeFromFavoritesBookmark
} from "../../../../redux/bookmarks/bookmarks.actions";

export default function FavoritesScreen() {

    const dispatch = useDispatch();
    const favorites = useSelector((state: any) => state.bookmarks.favorites);

    const {fetch: fetchBookmarks} = useHttpGet('bookmarks', {favorites: 1}, true);
    const {deleteAction} = useHttpDelete();
    const {execute: updateBookmarkRequest} = useHttpPut();

    useEffect(() => {
        dispatch(initializeFavoriteBookmarks());
        fetchBookmarks().then((data) => {
            dispatch(initializedFavoriteBookmarks(data));
        });
    }, [])

    const onFavoriteUpdate = (bookmarkId: string, isFavorite: boolean) => {
        updateBookmarkRequest(`bookmarks/${bookmarkId}`, {isFavorite: isFavorite}).then((data) => {
            if(data.isFavorite) {
                dispatch(addToFavoritesBookmark(data));
            } else {
                dispatch(removeFromFavoritesBookmark(data));
            }
        });
    }

    const onDelete = (bookmark: any) => {
        deleteAction(`bookmarks/${bookmark.id}`).then((response) => {
            dispatch(deleteBookmark(bookmark.id));
        });
    }

    return <Container>
        <Typography variant={'h4'}>Favorites</Typography>
        {favorites.isLoading ? <Box>Loading...</Box> : <BookmarksList bookmarks={favorites.data} onDelete={onDelete} onFavoriteUpdate={onFavoriteUpdate} onArchivedUpdate={() => {}} />}
    </Container>;

}