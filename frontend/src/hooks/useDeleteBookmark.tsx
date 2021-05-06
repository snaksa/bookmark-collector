import { useDispatch } from "react-redux";
import useHttpPut from "./useHttpPut";
import {
  addToArchivedBookmark,
  deleteBookmark,
  removeFromArchivedBookmark,
} from "../redux/bookmarks/bookmarks.actions";
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
