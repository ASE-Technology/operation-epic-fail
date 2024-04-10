import { Component, OnInit } from '@angular/core';
import { FileService } from '../../../services/file.service';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewFileUploadComponent } from './new-file-upload/new-file-upload.component';
import { SignalrService } from '../../../services/signalr.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-files-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './files-list.component.html',
  styleUrl: './files-list.component.css'
})
export class FilesListComponent implements OnInit {

  files$!: Observable<any[]>;
  refreshFiles$ = new BehaviorSubject<boolean>(true);
  files: any[] = [];

  constructor(
    private fileService: FileService,
    private signalrService: SignalrService,
    private toastrService: ToastrService,
    private modal: NgbModal) {
  }

  ngOnInit(): void {
    this.signalrService.fileProcesses$.subscribe((message: string) =>
      this.toastrService.success(message, "File process")
    );

    this.files$ = this.refreshFiles$.pipe(switchMap(_ => this.fileService.getFiles().pipe(tap(files => this.files = files))));
  }

  onAddModalOpen() {
    this.modal.open(NewFileUploadComponent).closed.subscribe(uploaded => {
      if (uploaded) {
        this.toastrService.success("File uploaded successfully!", "File upload");
        this.refreshFiles$.next(true);
      }
    });
  }

  onDownload(file: any) {
    this.fileService.downloadFile(file.id).subscribe((data) => {
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = file.filename;
      link.click();
    });
  }
}
