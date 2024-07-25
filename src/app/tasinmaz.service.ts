import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tasinmaz } from './models/tasinmaz';
import { AuthService } from './mainPage/services/auth.service';
import { Il } from './models/il';
import { Ilce } from './models/ilce';
import { Mahalle } from './models/mahalle';

@Injectable({
  providedIn: 'root'
})
export class TasinmazService {
  
  private apiUrl = 'https://localhost:44312/api/'; // API URL

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
  }

  getTasinmazlar(): Observable<Tasinmaz[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Tasinmaz[]>(`${this.apiUrl}Tasinmaz`, { headers });
  }
  
  addTasinmaz(tasinmaz: Tasinmaz): Observable<Tasinmaz> {
    const headers = this.getAuthHeaders();
    return this.http.post<Tasinmaz>(`${this.apiUrl}Tasinmaz`, tasinmaz, { headers });
  }
  
  getIller(): Observable<Il[]> {
    return this.http.get<Il[]>(`${this.apiUrl}il/getAll`);
  }
 
  getIlcelerBySehirId(sehirId: number): Observable<Ilce[]> {
    return this.http.get<Ilce[]>(`${this.apiUrl}ilce/getBySehirId/${sehirId}`);
  }

  getMahallelerByIlceId(ilceId: number): Observable<Mahalle[]> {
    return this.http.get<Mahalle[]>(`${this.apiUrl}mahalle/getByIlceId/${ilceId}`);
  }
  
  deleteTasinmaz(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}Tasinmaz/${id}`, { headers });
  }

  updateTasinmaz(id: number, tasinmaz: Tasinmaz): Observable<Tasinmaz> {
    const headers = this.getAuthHeaders();
    return this.http.put<Tasinmaz>(`${this.apiUrl}Tasinmaz/${id}`, tasinmaz, { headers });
  }

  getTasinmazById(id: number): Observable<Tasinmaz> {
    const headers = this.getAuthHeaders();
    return this.http.get<Tasinmaz>(`${this.apiUrl}Tasinmaz/${id}`, { headers });
  }
}
