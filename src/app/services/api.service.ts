import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod'; // Use o arquivo .prod

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiJavaUrl = environment.apiJavaUrl;
  private apiPythonUrl = environment.apiPythonUrl;

  constructor(private http: HttpClient) {}

  removeBackground(imageData: any) {
    return this.http.post(`${this.apiPythonUrl}/remove-background`, imageData);
  }

  // Adicione outras funções que se comunicam com o backend Java se necessário
}
