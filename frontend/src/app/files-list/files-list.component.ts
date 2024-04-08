import { Component, OnInit } from '@angular/core';
import { FileService } from '../services/file.service';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewFileUploadComponent } from './new-file-upload/new-file-upload.component';

@Component({
  selector: 'app-files-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './files-list.component.html',
  styleUrl: './files-list.component.css'
})
export class FilesListComponent implements OnInit {

  files: any[] = [{Name:"aaaaaa"}];

  constructor(
    private fileService: FileService,
    private modal: NgbModal) {

  }

  ngOnInit(): void {
    this.fileService.getFiles().subscribe(files => {
      //this.files = files;
    });
  }

  onAddModalOpen() {
    this.modal.open(NewFileUploadComponent);
  }

  onDownload(file: any) {
    this.fileService.downloadFile(file.id).subscribe();
  }
}