import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IlService {
  private apiUrl = 'https://localhost:44312/api/iller';

  constructor(private http: HttpClient) { }

  getIller(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
