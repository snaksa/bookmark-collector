import useHttpPut from "./useHttpPut";
import {
  addToFavoritesBookmark,
  removeFromFavoritesBookmark,
} from "../redux/slices/bookmarks.slice";
import { useAppDispatch } from "./redux-hooks";

type FavoriteBookmarkUpdateResponse = (
  bookmarkId: string,
  isFavorite: boolean
) => void;

export default function useFavoriteBookmarkUpdate(): FavoriteBookmarkUpdateResponse {
  const { execute: updateBookmarkRequest } = useHttpPut();
  const dispatch = useAppDispatch();

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
