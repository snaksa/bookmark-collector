import { useDispatch } from "react-redux";
import useHttpPut from "./useHttpPut";
import {
  addToArchivedBookmark,
  removeFromArchivedBookmark,
} from "../redux/bookmarks/bookmarks.actions";

type ArchiveBookmarkUpdateType = (
  bookmarkId: string,
  isArchived: boolean
) => void;

export default function useArchiveBookmarkUpdate(): ArchiveBookmarkUpdateType {
  const { execute: updateBookmarkRequest } = useHttpPut();
  const dispatch = useDispatch();

  return (bookmarkId: string, isArchived: boolean) => {
    updateBookmarkRequest(`bookmarks/${bookmarkId}`, {
      isArchived: isArchived,
    }).then((data) => {
      if (isArchived) {
        dispatch(addToArchivedBookmark(data));
      } else {
        dispatch(removeFromArchivedBookmark(data));
      }
    });
  };
}
