import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service'; // Importa o serviço

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [ApiService], // Adiciona o serviço aos providers
  bootstrap: []
})
export class AppModule { }
