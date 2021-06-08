import { useAppDispatch } from "./redux-hooks";
import { deleteBookmark } from "../redux/slices/bookmarks/thunks";

type DeleteBookmarkResponse = (bookmarkId: string) => void;

export default function useDeleteBookmark(): DeleteBookmarkResponse {
  const dispatch = useAppDispatch();

  return (bookmarkId: string) => {
    dispatch(deleteBookmark(bookmarkId));
  };
}
