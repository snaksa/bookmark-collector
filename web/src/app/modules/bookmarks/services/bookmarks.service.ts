import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Bookmark } from '../../shared/models/bookmark.model';

@Injectable({
  providedIn: 'root',
})
export class BookmarksService {
  constructor(private http: HttpClient) {}

  public getBookmarks() {
    return this.http
      .get<{ data: Bookmark[] }>(`${environment.apiBaseUrl}/bookmarks`)
      .pipe(
        map((response) => {
          return response.data;
        })
      );
  }
}
