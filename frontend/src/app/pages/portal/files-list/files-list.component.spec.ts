import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilesListComponent } from './files-list.component';
import { FileService } from '../../../services/file.service';
import { SignalrService } from '../../../services/signalr.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { NewFileUploadComponent } from './new-file-upload/new-file-upload.component';

// Mock classes
class MockFileService {
  getFiles = jasmine.createSpy('getFiles').and.returnValue(of([{ id: 1, filename: 'file1.txt' }]));
  downloadFile = jasmine.createSpy('downloadFile').and.returnValue(of(new Blob()));
}

class MockSignalrService {
  fileProcesses$ = of('File processed successfully!');
}

class MockToastrService {
  success = jasmine.createSpy('success');
}

class MockNgbModal {
  open = jasmine.createSpy('open').and.returnValue({ closed: of(true) });
}

describe('FilesListComponent', () => {
  let component: FilesListComponent;
  let fixture: ComponentFixture<FilesListComponent>;
  let fileService: FileService;
  let toastrService: ToastrService;
  let modalService: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgbModule, // Import NgbModule if modal functionalities are used directly
        FilesListComponent // Import standalone component here
      ],
      providers: [
        { provide: FileService, useClass: MockFileService },
        { provide: SignalrService, useClass: MockSignalrService },
        { provide: ToastrService, useClass: MockToastrService },
        { provide: NgbModal, useClass: MockNgbModal }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilesListComponent);
    component = fixture.componentInstance;
    fileService = TestBed.inject(FileService);
    toastrService = TestBed.inject(ToastrService);
    modalService = TestBed.inject(NgbModal);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load files on init', () => {
    component.ngOnInit();
    expect(fileService.getFiles).toHaveBeenCalled();
    fixture.detectChanges();
    component.files$.subscribe((files) => {
      expect(files.length).toBe(1);
      expect(files[0].filename).toEqual('file1.txt');
    });
  });

// When calling onAddModalOpen
it('should open a modal for new file upload', () => {
  component.onAddModalOpen();
  expect(modalService.open).toHaveBeenCalledWith(NewFileUploadComponent); // Add the expected argument here
  fixture.detectChanges(); // Ensure any outstanding changes are applied
  modalService.open(NewFileUploadComponent).closed.subscribe(() => {
    expect(toastrService.success).toHaveBeenCalledWith('File uploaded successfully!', 'File upload');
  });
});

  it('should handle file download', () => {
    const file = { id: '123', filename: 'test.txt' };
    component.onDownload(file);
    expect(fileService.downloadFile).toHaveBeenCalledWith('123');
  });
});
