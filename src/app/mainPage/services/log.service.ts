import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Log } from 'src/app/models/log';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators'; // Bunu ekleyin

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private apiUrl = `${environment.apiUrl}/Log`;

  constructor(private http: HttpClient, private authService:AuthService) { }

  getAll(): Observable<Log[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.get<Log[]>(`${this.apiUrl}`, { headers }).pipe(
      tap(
        logs => console.log('Logs fetched successfully', logs),
        error => console.error('Error fetching logs', error)
      )
    );
  }
  
  

  /*searchLogs(term: string): Observable<Log[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<Log[]>(`${this.apiUrl}/search`, { term }, { headers });
  }
*/


getLogs(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}`);
}

searchLogs(searchTerm: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/search?term=${searchTerm}`);
}


  getById(id: number): Observable<Log> {
    return this.http.get<Log>(`${this.apiUrl}/${id}`);
  }

  add(log: Log): Observable<Log> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<Log>(this.apiUrl, log, { headers });
  }

  update(id: number, log: Log): Observable<Log> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put<Log>(`${this.apiUrl}/${id}`, log, { headers });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
