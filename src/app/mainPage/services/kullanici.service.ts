import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/kullanici';

@Injectable({
  providedIn: 'root'
})
export class KullaniciService {
  private userApiUrl = 'https://localhost:44312/api/User'; // Kullanıcı işlemleri için URL
  private authApiUrl = 'https://localhost:44312/api/Auth/register'; // Kayıt işlemleri için URL

  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.userApiUrl);
  }

  add(user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<User>(this.authApiUrl, user, { headers }); // Kayıt URL'si kullanılıyor
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.userApiUrl}/${id}`);
  }

  update(id: number, user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<User>(`${this.userApiUrl}/${id}`, user, { headers });
  }

  
}
