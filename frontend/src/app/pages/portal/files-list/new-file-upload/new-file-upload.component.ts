import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '../../../../services/file.service';

@Component({
  selector: 'app-new-file-upload',
  standalone: true,
  imports: [],
  templateUrl: './new-file-upload.component.html',
  styleUrl: './new-file-upload.component.css'
})
export class NewFileUploadComponent {

  activeModal = inject(NgbActiveModal);
  selectedFile: any | null;

  constructor(private fileService: FileService) {

  }

  onFileChanged(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    if (element.files?.length) {
      this.selectedFile = element.files[0];
    }
  }

  onUpload() {
    if (this.selectedFile) {
      this.fileService.addFile(this.selectedFile).subscribe(_ => {
        this.activeModal.close(true);
      });
    }
  }
}
