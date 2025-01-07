import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { saveAs } from 'file-saver';
import { environment } from '../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  imports: [
    HttpClientModule,
    CommonModule
  ]
})
export class UploadComponent implements OnInit {
  selectedFile: File | null = null;
  images: any[] = [];
  processedImageUrl: string | null = null;
  isRemovingBackground: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadImages();
    document.addEventListener('paste', this.handlePaste.bind(this));
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.processedImageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  handlePaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items;
    if (items) {
      for (let i = 0; items && i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            this.selectedFile = file;
            const reader = new FileReader();
            reader.onload = () => {
              this.processedImageUrl = reader.result as string;
            };
            reader.readAsDataURL(file);
          }
        }
      }
    }
  }

  // Função de Upload Atualizada:
  onUpload() {
    if (this.selectedFile) {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
  
        this.http.post(`${environment.apiJavaUrl}/api/images/upload`, formData)
            .subscribe(
                (response: any) => {
                    console.log('Upload Successful', response);
  
                    if (response && response.processedImageData) {
                        const base64Data = response.processedImageData;
                        console.log('Base64 Data Length:', base64Data.length);
                        console.log('Base64 Data:', base64Data);
  
                        if (base64Data) {
                            try {
                                const processedImageUrl = `data:image/png;base64,${base64Data}`;
                                console.log('Processed Image URL:', processedImageUrl);
  
                                const processedImage = {
                                    id: response.processedImageId,
                                    url: processedImageUrl
                                };
  
                                this.images.push({ id: response.originalImageId, url: this.processedImageUrl });
                                this.images.push(processedImage);
                                this.processedImageUrl = processedImageUrl;
                            } catch (e) {
                                console.error('Erro ao decodificar a string base64:', e);
                            }
                        } else {
                            console.error('Processed image data is undefined or null');
                        }
                    } else {
                        console.error('Processed image data is missing in response', response);
                    }
                    this.loadImages();
                },
                (error: any) => {
                    console.error('Upload Failed', error);
                }
            );
    }
  }
  

  onRemoveBackground() {
    if (this.selectedFile) {
      this.isRemovingBackground = true;
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      console.log('Fazendo requisição POST para remover o background...');
      this.http.post(`${environment.apiPythonUrl}/remove-background`, formData)
        .subscribe(
          (response: any) => {
            if (response && response.data) {
              const imageData = `data:image/png;base64,${response.data}`;
              this.processedImageUrl = imageData;
              console.log('Background Removal Successful');
            } else {
              console.error('Invalid Response Structure', response);
            }
            this.isRemovingBackground = false;
          },
          (error: any) => {
            this.isRemovingBackground = false;
            console.error('Background Removal Failed', error);
            console.log('URL Utilizada:', `${environment.apiPythonUrl}/remove-background`);
          }
        );
    }
  }

  downloadImage(imageId: number, fileName: string) {
    this.http.get(`${environment.apiJavaUrl}/api/images/download/${imageId}`, { responseType: 'blob' })
      .subscribe(
        (response: Blob) => {
          saveAs(response, fileName);
        },
        (error: any) => {
          console.error('Download Failed', error);
        }
      );
  }

  deleteImage(imageId: number) {
    this.http.delete(`${environment.apiJavaUrl}/api/images/delete/${imageId}`)
      .subscribe(
        () => {
          console.log('Image Deleted');
          this.loadImages();
        },
        (error: any) => {
          console.error('Delete Failed', error);
        }
      );
  }

  loadImages() {
    this.http.get<any[]>(`${environment.apiJavaUrl}/api/images/all`).subscribe(
      (images) => {
        this.images = images;
      },
      (error: any) => {
        console.error('Failed to load images', error);
        console.log('URL Utilizada:', `${environment.apiJavaUrl}/api/images/all`);
      }
    );
  }
}
