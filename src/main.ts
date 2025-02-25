import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment.prod';

console.log('Ambiente de produção:', environment.production);
console.log('API Java URL:', environment.apiJavaUrl);
console.log('API Python URL:', environment.apiPythonUrl);

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule)
  ]
}).catch((err: any) => console.error(err));
