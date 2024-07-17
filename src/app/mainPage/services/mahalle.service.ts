import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mahalle } from 'src/app/models/mahalle';

@Injectable({
  providedIn: 'root'
})
export class MahalleService {
  private apiUrl = 'https://localhost:44312/api/Mahalle';

  constructor(private http: HttpClient) { }

  getMahallelerByIlceId(ilceId:number): Observable<Mahalle[]> {
    return this.http.get<Mahalle[]>(`${this.apiUrl}/by-ilce/${ilceId}`);
  }
  
}
