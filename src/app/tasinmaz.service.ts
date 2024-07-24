import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tasinmaz } from './models/tasinmaz';
import { Ilce } from './models/ilce';
import { Mahalle } from './models/mahalle';
import { Il } from './models/il';

@Injectable({
  providedIn: 'root'
})
export class TasinmazService {
  
  private apiUrl = 'https://localhost:44312/api/'; // API URL

  constructor(private http: HttpClient) {}

  getTasinmazlar(): Observable<Tasinmaz[]> {
    return this.http.get<Tasinmaz[]>(`${this.apiUrl}Tasinmaz`);
  }
  
  addTasinmaz(tasinmaz: Tasinmaz): Observable<Tasinmaz> {
    return this.http.post<Tasinmaz>(`${this.apiUrl}Tasinmaz`, tasinmaz);
  }
  
  getIller(): Observable<Il[]> {
    return this.http.get<Il[]>(`${this.apiUrl}il/getAll`);
  }
 
  getIlcelerBySehirId(sehirId: number): Observable<Ilce[]> {
    return this.http.get<Ilce[]>(`${this.apiUrl}ilce/getBySehirId/${sehirId}`);
  }

  getMahallelerByIlceId(ilceId : number): Observable<Mahalle[]> {
    return this.http.get<Mahalle[]>(`${this.apiUrl}mahalle/getByIlceId/${ilceId}`);
  }
  
  deleteTasinmaz(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}Tasinmaz/${id}`);
  }

  updateTasinmaz(id: number, tasinmaz: Tasinmaz): Observable<Tasinmaz> {
    return this.http.put<Tasinmaz>(`${this.apiUrl}Tasinmaz/${id}`, tasinmaz);
  }

  getTasinmazById(id: number): Observable<Tasinmaz> {
    return this.http.get<Tasinmaz>(`${this.apiUrl}Tasinmaz/${id}`);
  }
}
