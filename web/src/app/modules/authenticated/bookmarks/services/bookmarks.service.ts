import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Bookmark } from '../../../shared/models/bookmark.model';

@Injectable({
  providedIn: 'root',
})
export class BookmarksService {
  constructor(private http: HttpClient) {}

  public getBookmarks(onlyFavorites = false, onlyArchived = false, excludeArchived = true) {
    return this.http
      .get<{ data: Bookmark[] }>(`${environment.apiBaseUrl}/bookmarks`, {
        params: {
          favorites: onlyFavorites ? 1 : 0,
          archived: onlyArchived ? 1 : 0,
          excludeArchived: excludeArchived ? 1 : 0,
        },
      })
      .pipe(
        map((response) => {
          return response.data;
        })
      );
  }

  public getBookmark(id: string) {
    return this.http.get<{ data: Bookmark }>(`${environment.apiBaseUrl}/bookmarks/${id}`).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  public createBookmark(url: string) {
    return this.http.post<{ data: Bookmark }>(`${environment.apiBaseUrl}/bookmarks`, { url }).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  public updateBookmark(id: string, data: Partial<Bookmark & { labelIds: string[]; newLabels: string[] }>) {
    return this.http.put<{ data: Bookmark }>(`${environment.apiBaseUrl}/bookmarks/${id}`, data).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  public deleteBookmark(id: string) {
    return this.http.delete(`${environment.apiBaseUrl}/bookmarks/${id}`).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
