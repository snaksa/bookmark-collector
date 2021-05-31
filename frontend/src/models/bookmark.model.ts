import { Label } from "./label.model";

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  image: string;
  isFavorite: boolean;
  isArchived: boolean;
  labels: Label[];
}
