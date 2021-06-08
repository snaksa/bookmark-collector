import { useAppDispatch } from "./redux-hooks";
import {
  addBookmarkToFavorites,
  removeBookmarkFromFavorites,
} from "../redux/slices/bookmarks/thunks";

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
