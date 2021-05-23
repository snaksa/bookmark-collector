import { deleteBookmark } from "../redux/slices/bookmarks.slice";
import useHttpDelete from "./useHttpDelete";
import { useAppDispatch } from "./redux-hooks";

type DeleteBookmarkResponse = (bookmarkId: string) => void;

export default function useDeleteBookmark(): DeleteBookmarkResponse {
  const { deleteAction } = useHttpDelete();
  const dispatch = useAppDispatch();

  return (bookmarkId: string) => {
    deleteAction(`bookmarks/${bookmarkId}`).then(() => {
      dispatch(deleteBookmark(bookmarkId));
    });
  };
}
