import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Log } from 'src/app/models/log';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private apiUrl = 'https://localhost:44312/api/Log';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Log[]> {
    return this.http.get<Log[]>(this.apiUrl);
  }

  get(id: number): Observable<Log> {
    return this.http.get<Log>(`${this.apiUrl}/${id}`);
  }

  add(log: Log): Observable<Log> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Log>(this.apiUrl, log, { headers });
  }

  update(id: number, log: Log): Observable<Log> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Log>(`${this.apiUrl}/${id}`, log, { headers });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
