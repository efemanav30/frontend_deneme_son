import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MahalleService {
  private apiUrl = 'https://localhost:44312/api/Mahalle';

  constructor(private http: HttpClient) { }

  getMahallelerByIlceId(ilceId:number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
}
