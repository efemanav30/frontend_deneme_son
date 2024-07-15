import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IlceService {
  private apiUrl = 'https://localhost:44312/api/ilceler';

  constructor(private http: HttpClient) { }

  getIlcelerByIlId(ilId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?ilId=${ilId}`);
  }
}
