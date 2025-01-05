import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { environment } from '../environments/environment.prod';
import { UploadComponent } from './upload/upload.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ApiService],
  imports: [UploadComponent]
})
export class AppComponent implements OnInit {
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    console.log('Ambiente:', environment);
  }

  onRemoveBackground(imageData: any) {
    this.apiService.removeBackground(imageData).subscribe(
      (response) => {
        console.log('Background removido com sucesso', response);
      },
      (error) => {
        console.error('Falha na remoção do fundo', error);
      }
    );
  }
}
