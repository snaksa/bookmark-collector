import BookmarkLabel from "../models/bookmark-label.model";
import Bookmark from "../models/bookmark.model";
import Label from "../models/label.model";
import { QueryBuilder } from "../services/query-builder";

export class BookmarkRepository {
    constructor(private dbStore: string, private reversedDbStore: string = '', private dbStoreGSI1: string = '') { }

    async save(bookmark: Bookmark): Promise<boolean> {
        return new QueryBuilder<Bookmark>()
            .table(this.dbStore)
            .create(bookmark);
    }

    async saveLabel(bookmarkLabel: BookmarkLabel): Promise<boolean> {
        return new QueryBuilder<BookmarkLabel>()
            .table(this.dbStore)
            .create(bookmarkLabel);
    }

    async findBookmarkRecords(bookmarkId: string): Promise<Bookmark[]> {
        const bookmarks = await new QueryBuilder<Bookmark>()
            .table(this.dbStore)
            .index(this.reversedDbStore)
            .where({
                sk: `BOOKMARK#${bookmarkId}`,
            })
            .all();

        return bookmarks;
    }

    async findAll(userId: string): Promise<Bookmark[]> {
        const records: BookmarkLabel[] = await new QueryBuilder<BookmarkLabel>()
            .table(this.dbStore)
            .index(this.dbStoreGSI1)
            .where({
                GSI1: `USER#${userId}`,
            })
            .all();

        let bookmarks: {[key: string]: Bookmark} = {};
        records.forEach((record: BookmarkLabel) => {
            if(!(record.bookmarkId in bookmarks)) {
                bookmarks[record.bookmarkId] = new Bookmark(record.bookmarkId, record.userId, record.bookmarkUrl);
            }

            if(record.entityType === BookmarkLabel.ENTITY_TYPE) {
                const label = new Label(record.labelId, record.userId, record.title, record.color);
                bookmarks[record.bookmarkId].addLabel(label);
            }
        });

        return Object.values(bookmarks);
    }

    async deleteByKeys(pk: string, sk: string): Promise<Bookmark> {
        return new QueryBuilder<Bookmark>()
            .table(process.env.dbStore ?? '')
            .where({
                pk: pk,
                sk: sk,
            })
            .delete();
    }
}