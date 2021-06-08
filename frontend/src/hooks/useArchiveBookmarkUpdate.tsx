import { useAppDispatch } from "./redux-hooks";
import {
  addBookmarkToArchived,
  removeBookmarkFromArchived,
} from "../redux/slices/bookmarks/thunks";

type ArchiveBookmarkUpdateType = (
  bookmarkId: string,
  isArchived: boolean
) => void;

export default function useArchiveBookmarkUpdate(): ArchiveBookmarkUpdateType {
  const dispatch = useAppDispatch();

  return (bookmarkId: string, isArchived: boolean) => {
    if (isArchived) {
      dispatch(addBookmarkToArchived(bookmarkId));
    } else {
      dispatch(removeBookmarkFromArchived(bookmarkId));
    }
  };
}
