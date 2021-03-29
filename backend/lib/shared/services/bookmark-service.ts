import BookmarkLabel from "../models/bookmark-label.model";
import Bookmark from "../models/bookmark.model";
import { QueryBuilder } from "./query-builder";

export class BookmarkService {
    constructor(private dbStore: string) { }

    async save(bookmark: Bookmark): Promise<boolean> {
        return await new QueryBuilder<Bookmark>()
            .table(this.dbStore)
            .create(bookmark);
    }

    async saveLabel(bookmarkLabel: BookmarkLabel): Promise<boolean> {
        return await new QueryBuilder<BookmarkLabel>()
            .table(this.dbStore)
            .create(bookmarkLabel);
    }
}