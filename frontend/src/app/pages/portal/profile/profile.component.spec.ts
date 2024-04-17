import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { ProfileComponent } from './profile.component';
import { AuthenticationService } from '../../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { PasswordMismatchValidator } from '../../../shared/validators/password-mismatch.validator';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authServiceMock: any;
  let toastrServiceMock: any;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthenticationService', ['getProfile', 'updateProfile', 'login']);
    toastrServiceMock = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, ProfileComponent],
      providers: [
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    
    // Mock getProfile to automatically call bouildProfileForm with mocked data
    authServiceMock.getProfile.and.returnValue(of({ email: 'user@example.com' }));
    fixture.detectChanges(); // Triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build the profile form with fetched data', () => {
    expect(component.profileForm).toBeTruthy();
    expect(component.profileForm.get('email')?.value).toEqual('user@example.com');
    expect(component.profileForm.get('currentPassword')?.value).toEqual('');
  });

  it('should validate password mismatch', () => {
    component.profileForm.setValue({
      email: 'user@example.com',
      currentPassword: 'current',
      newPassword: 'newPassword',
      newPasswordAgain: 'differentNewPassword'
    });
    expect(component.profileForm.invalid).toBeTrue();
  });

  it('should handle successful profile update', () => {
    authServiceMock.updateProfile.and.returnValue(of({}));
    authServiceMock.login.and.returnValue(of({ accessToken: 'newToken' }));
    component.profileForm.setValue({
      email: 'user@example.com',
      currentPassword: 'current',
      newPassword: 'newPassword',
      newPasswordAgain: 'newPassword'
    });

    component.onSubmit();
    expect(authServiceMock.updateProfile).toHaveBeenCalled();
    expect(authServiceMock.login).toHaveBeenCalled();
    expect(toastrServiceMock.success).toHaveBeenCalledWith("Profile updated successfully!", "Profile update");
  });

  it('should handle profile update failure', () => {
    const errorResponse = { message: 'Update failed' };
    authServiceMock.updateProfile.and.returnValue(throwError(() => errorResponse));
    component.profileForm.setValue({
      email: 'user@example.com',
      currentPassword: 'current',
      newPassword: 'newPassword',
      newPasswordAgain: 'newPassword'
    });

    component.onSubmit();
    expect(component.errorMessage).toEqual('Update failed');
  });
});
