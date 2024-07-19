// src/app/services/tasinmaz.service.ts
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
  path: any;
  getTasinmaz: any;

  constructor(private http: HttpClient) {}

  getTasinmazlar(): Observable<Tasinmaz[]> {
    return this.http.get<Tasinmaz[]>(`${this.apiUrl}Tasinmaz`);
  }
  
  
  addTasinmaz(tasinmaz): Observable<Tasinmaz[]> {
    return this.http.post<Tasinmaz[]>(`https://localhost:44312/api/Tasinmaz`, tasinmaz);
    //return this.http.post<Tasinmaz>("https://localhost:44364/api/tasinmaz/add/", newTasinmaz);
  }

  
  getIller(): Observable<Il[]> {
    return this.http.get<Il[]>(`${this.path}il/getAll`);
  }
 
  getIlcelerBySehirId(sehirId: number): Observable<Ilce[]> {
    return this.http.get<Ilce[]>(`${this.path}ilce/getBySehirId/${sehirId}`);
  }

  getMahallelerByIlceId(ilceId : number): Observable<Mahalle[]> {
    return this.http.get<Mahalle[]>(`${this.path}mahalle/getBySehirId${ilceId}`);
  }
  
  deleteTasinmaz(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}Tasinmaz/${id}`);
  }

  updateTasinmaz(tasinmaz: Tasinmaz): Observable<Tasinmaz> {
    return this.http.put<Tasinmaz>(`https://localhost:44312/api/Tasinmaz/${tasinmaz.id}`, tasinmaz);
  }

  getTasinmazById(id: number): Observable<Tasinmaz> {
    return this.http.get<Tasinmaz>(`${this.apiUrl}Tasinmaz/${id}`);
  }
}
