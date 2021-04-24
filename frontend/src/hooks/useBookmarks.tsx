import React, { createContext, useState, useContext } from "react";

export interface BookmarksContextProps {
  bookmarks: any;
  addBookmarks: Function;
  removeBookmarks: Function;
}

const initialProps: BookmarksContextProps = {
  bookmarks: [],
  addBookmarks: () => {},
  removeBookmarks: () => {},
};

export const BookmarksContext = createContext<BookmarksContextProps>(
  initialProps
);

const BookmarksProvider = (props: any) => {
  const [bookmarks, setBookmarks] = useState([]);

  const addBookmarks = (newBookmarks: []) => {
    setBookmarks([...newBookmarks, ...bookmarks]);
  }

  const removeBookmarks = (removeBookmarks: any) => {
    const ids = removeBookmarks.map((bookmark: any) => bookmark.id);
    setBookmarks(bookmarks.filter((bookmark: any) => !ids.includes(bookmark.id)));
  }

  const value = { bookmarks, addBookmarks, removeBookmarks };

  return <BookmarksContext.Provider value={value} {...props} />;
}

export const useBookmarks = () => useContext(BookmarksContext);

export default BookmarksProvider;