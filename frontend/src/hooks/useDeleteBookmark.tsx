import { useDispatch } from "react-redux";
import { deleteBookmark } from "../redux/slices/bookmarks.slice";
import useHttpDelete from "./useHttpDelete";

type DeleteBookmarkType = (bookmark: any) => void;

export default function useDeleteBookmark(): DeleteBookmarkType {
  const { deleteAction } = useHttpDelete();
  const dispatch = useDispatch();

  return (bookmarkId: string) => {
    deleteAction(`bookmarks/${bookmarkId}`).then((response) => {
      dispatch(deleteBookmark(bookmarkId));
    });
  };
}
