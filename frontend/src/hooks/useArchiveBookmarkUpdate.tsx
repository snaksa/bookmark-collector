import useHttpPut from "./useHttpPut";
import {
  addToArchivedBookmark,
  removeFromArchivedBookmark,
} from "../redux/slices/bookmarks.slice";
import { useAppDispatch } from "./redux-hooks";

type ArchiveBookmarkUpdateType = (
  bookmarkId: string,
  isArchived: boolean
) => void;

export default function useArchiveBookmarkUpdate(): ArchiveBookmarkUpdateType {
  const { execute: updateBookmarkRequest } = useHttpPut();
  const dispatch = useAppDispatch();

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
