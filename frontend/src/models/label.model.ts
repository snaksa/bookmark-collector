import { Bookmark } from "./bookmark.model";

export interface Label {
  id: string;
  title: string;
  color: string;
  bookmarks: Bookmark[];
}
