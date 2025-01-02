import { Component } from '@angular/core';
import { UploadComponent } from './upload/upload.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    UploadComponent
  ]
})
export class AppComponent {
  title = 'remove-bg-app'; // Adicione a propriedade title
}