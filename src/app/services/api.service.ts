// src/app/services/api.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';  // Certifique-se de estar importando o .prod

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiJavaUrl = environment.apiJavaUrl;
  private apiPythonUrl = environment.apiPythonUrl;

  constructor(private http: HttpClient) {
    console.log('API Java URL:', this.apiJavaUrl);  // Adicionando log para ver a URL usada
    console.log('API Python URL:', this.apiPythonUrl);
  }

  removeBackground(imageData: any) {
    return this.http.post(`${this.apiPythonUrl}/remove-background`, imageData);
  }
}
