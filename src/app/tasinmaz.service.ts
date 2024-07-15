// src/app/services/tasinmaz.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tasinmaz } from './models/tasinmaz';

@Injectable({
  providedIn: 'root'
})
export class TasinmazService {
  private apiUrl = 'https://localhost:44312/api/Tasinmaz'; // API URL

  constructor(private http: HttpClient) {}

  getTasinmazlar(): Observable<Tasinmaz[]> {
    return this.http.get<Tasinmaz[]>(this.apiUrl);
  }
}
