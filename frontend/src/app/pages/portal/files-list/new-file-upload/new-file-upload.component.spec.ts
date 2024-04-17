import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NewFileUploadComponent } from './new-file-upload.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '../../../../services/file.service';
import { of } from 'rxjs';

class MockFileService {
  addFile = jasmine.createSpy('addFile').and.returnValue(of({}));
}

class MockNgbActiveModal {
  close = jasmine.createSpy('close');
}

describe('NewFileUploadComponent', () => {
  let component: NewFileUploadComponent;
  let fixture: ComponentFixture<NewFileUploadComponent>;
  let fileService: FileService;
  let activeModal: NgbActiveModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewFileUploadComponent],
      providers: [
        { provide: FileService, useClass: MockFileService },
        { provide: NgbActiveModal, useClass: MockNgbActiveModal }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewFileUploadComponent);
    component = fixture.componentInstance;
    fileService = TestBed.inject(FileService);
    activeModal = TestBed.inject(NgbActiveModal);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle file selection', fakeAsync(() => {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';

    const file = new File(['content'], 'test-file.txt', { type: 'text/plain' });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    inputElement.files = dataTransfer.files;

    const event = new Event('change', { bubbles: true });
    Object.defineProperty(event, 'currentTarget', { value: inputElement, writable: false, enumerable: true });

    // Call the component's file changed method instead of dispatching the event to ensure 'currentTarget' is set
    component.onFileChanged(event);
    tick();

    fixture.detectChanges(); // Update bindings and check for changes

    expect(component.selectedFile).toEqual(file);
  }));

  it('should upload file and close modal on successful upload', fakeAsync(() => {
    component.selectedFile = new File([''], 'test-file.txt');
    component.onUpload();
    tick();  // Process the observables

    expect(fileService.addFile).toHaveBeenCalledWith(component.selectedFile);
    expect(activeModal.close).toHaveBeenCalledWith(true);
  }));
});
