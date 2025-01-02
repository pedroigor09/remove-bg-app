import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { saveAs } from 'file-saver';

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
  processedImageId: number | null = null;
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
      for (let i = 0; i < items.length; i++) {
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

  onUpload() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.http.post('http://localhost:8080/api/images/upload', formData)
        .subscribe(
          (response: any) => {
            console.log('Upload Successful', response);
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

      this.http.post('http://localhost:8080/api/images/remove-background', formData)
        .subscribe(
          (response: any) => {
            this.processedImageId = response.id;
            const imageData = `data:image/png;base64,${response.data}`;
            this.processedImageUrl = imageData;
            this.isRemovingBackground = false;
            console.log('Background Removal Successful');
          },
          (error: any) => {
            this.isRemovingBackground = false;
            console.error('Background Removal Failed', error);
          }
        );
    }
  }

  downloadImage(imageId: number, fileName: string) {
    this.http.get(`http://localhost:8080/api/images/download/${imageId}`, { responseType: 'blob' })
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
    this.http.delete(`http://localhost:8080/api/images/delete/${imageId}`)
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
    this.http.get<any[]>('http://localhost:8080/api/images/all')
      .subscribe(images => {
        this.images = images;
      },
      (error: any) => {
        console.error('Failed to load images', error);
      });
  }
}
