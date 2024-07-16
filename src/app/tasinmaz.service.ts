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

  constructor(private http: HttpClient) {}

  getTasinmazlar(): Observable<Tasinmaz[]> {
    return this.http.get<Tasinmaz[]>(`${this.apiUrl}Tasinmaz`);
  }
  
  
  addTasinmaz(tasinmaz): Observable<Tasinmaz[]> {
    return this.http.post<Tasinmaz[]>(`https://localhost:44312/api/Tasinmaz`, tasinmaz);
    //return this.http.post<Tasinmaz>("https://localhost:44364/api/tasinmaz/add/", newTasinmaz);
  }
}
