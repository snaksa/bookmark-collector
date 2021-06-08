import { Bookmark } from "../models/bookmark.model";
import HttpService, { ResponseType } from "./http.service";

type BookmarksListResponseType = ResponseType & {
  data?: Bookmark[];
};

type BookmarkResponseType = ResponseType & {
  data?: Bookmark;
};

export default class BookmarkService {
  public static async getCurrentUserList(
    excludeArchived = false,
    onlyFavorites = false,
    onlyArchived = false
  ): Promise<BookmarksListResponseType> {
    return await new HttpService<BookmarksListResponseType>().get("bookmarks", {
      excludeArchived: excludeArchived ? 1 : 0,
      favorites: onlyFavorites ? 1 : 0,
      archived: onlyArchived ? 1 : 0,
    });
  }

  public static async createBookmark(
    url: string
  ): Promise<BookmarkResponseType> {
    return await new HttpService<BookmarkResponseType>().post("bookmarks", {
      url,
    });
  }

  public static async updateBookmark(
    id: string,
    data: Partial<Bookmark>
  ): Promise<BookmarkResponseType> {
    return await new HttpService<BookmarkResponseType>().put(
      `bookmarks/${id}`,
      data
    );
  }

  public static async updateLabels(
    id: string,
    labelIds: string[],
    newLabels: string[]
  ): Promise<BookmarkResponseType> {
    return await new HttpService<BookmarkResponseType>().put(
      `bookmarks/${id}`,
      {
        labelIds,
        newLabels,
      }
    );
  }

  public static async deleteBookmark(id: string): Promise<ResponseType> {
    return await new HttpService<ResponseType>().delete(`bookmarks/${id}`);
  }
}
