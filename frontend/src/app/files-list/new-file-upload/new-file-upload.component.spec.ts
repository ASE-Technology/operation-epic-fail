import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFileUploadComponent } from './new-file-upload.component';

describe('NewFileUploadComponent', () => {
  let component: NewFileUploadComponent;
  let fixture: ComponentFixture<NewFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewFileUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
