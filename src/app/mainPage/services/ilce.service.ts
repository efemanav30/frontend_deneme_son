import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ilce } from 'src/app/models/ilce';

@Injectable({
  providedIn: 'root'
})
export class IlceService {
  private apiUrl = 'https://localhost:44312/api/ilce';

  constructor(private http: HttpClient) { }

  getIlcelerByIlId(ilId: number): Observable<Ilce[]> {
    return this.http.get<Ilce[]>(`${this.apiUrl}/by-il/${ilId}`);
  }
}
