// src/app/services/api.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod'; // Importa o ambiente de produção

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  removeBackground(imageData: any) {
    return this.http.post(`${this.apiUrl}/images/remove-background`, imageData);
  }
}
