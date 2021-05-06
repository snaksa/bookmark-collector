import { useDispatch } from "react-redux";
import useHttpPut from "./useHttpPut";
import {
  addToFavoritesBookmark,
  removeFromFavoritesBookmark,
} from "../redux/bookmarks/bookmarks.actions";

type FavoriteBookmarkUpdateType = (
  bookmarkId: string,
  isFavorite: boolean
) => void;

export default function useFavoriteBookmarkUpdate(): FavoriteBookmarkUpdateType {
  const { execute: updateBookmarkRequest } = useHttpPut();
  const dispatch = useDispatch();

  return (bookmarkId: string, isFavorite: boolean) => {
    updateBookmarkRequest(`bookmarks/${bookmarkId}`, {
      isFavorite: isFavorite,
    }).then((data) => {
      if (isFavorite) {
        dispatch(addToFavoritesBookmark(data));
      } else {
        dispatch(removeFromFavoritesBookmark(data));
      }
    });
  };
}
