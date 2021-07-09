import { Bookmark } from '../../../shared/models/bookmark.model';
import { AppState } from '../../../../state/app.state';

export interface BookmarksState {
  list: {
    data: Bookmark[];
    isLoading: boolean;
    isInitialized: boolean;
    error: string;
  };

  favorites: {
    data: Bookmark[];
    isLoading: boolean;
    isInitialized: boolean;
    error: string;
  };

  archived: {
    data: Bookmark[];
    isLoading: boolean;
    isInitialized: boolean;
    error: string;
  };
}

export interface State extends AppState {
  bookmarks: BookmarksState;
}
