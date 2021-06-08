import {
  addBookmarkToFavorites,
  removeBookmarkFromFavorites,
} from "../redux/slices/bookmarks.slice";
import { useAppDispatch } from "./redux-hooks";

type FavoriteBookmarkUpdateResponse = (
  bookmarkId: string,
  isFavorite: boolean
) => void;

export default function useFavoriteBookmarkUpdate(): FavoriteBookmarkUpdateResponse {
  const dispatch = useAppDispatch();

  return (bookmarkId: string, isFavorite: boolean) => {
    if (isFavorite) {
      dispatch(addBookmarkToFavorites(bookmarkId));
    } else {
      dispatch(removeBookmarkFromFavorites(bookmarkId));
    }
  };
}
