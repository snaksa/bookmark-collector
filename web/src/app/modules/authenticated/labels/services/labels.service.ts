import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Label } from '../../../shared/models/label.model';

@Injectable({
  providedIn: 'root'
})
export class LabelsService {
  constructor(private http: HttpClient) {
  }

  public getLabels() {
    return this.http.get<{ data: Label[] }>(`${environment.apiBaseUrl}/labels`).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  public getLabelBookmarks(id: string) {
    return this.http.get<{ data: Label }>(`${environment.apiBaseUrl}/labels/${id}`).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  public deleteLabel(id: string) {
    return this.http.delete(`${environment.apiBaseUrl}/labels/${id}`).pipe(
      map((response) => {
        return id;
      })
    );
  }
}
