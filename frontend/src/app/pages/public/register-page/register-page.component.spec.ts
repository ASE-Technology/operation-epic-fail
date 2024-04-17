import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterPageComponent } from './register-page.component';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CommonModule, Location } from '@angular/common';

describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthenticationService', ['register']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RegisterPageComponent
      ],
      providers: [
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the registration form', () => {
    expect(component.registerForm).toBeTruthy();
    expect(component.registerForm.get('email')).toBeTruthy();
    expect(component.registerForm.get('password')).toBeTruthy();
    expect(component.registerForm.get('passwordAgain')).toBeTruthy();
  });

  it('should validate that the passwords match', () => {
    component.registerForm.controls['email'].setValue('test@example.com');
    component.registerForm.controls['password'].setValue('123456');
    component.registerForm.controls['passwordAgain'].setValue('1234567');
    expect(component.registerForm.invalid).toBeTruthy();
    component.registerForm.controls['passwordAgain'].setValue('123456');
    expect(component.registerForm.valid).toBeTruthy();
  });

  it('should handle successful registration', () => {
    const mockResponse = {}; // You can customize this based on the response structure
    authServiceMock.register.and.returnValue(of(mockResponse));
    component.registerForm.controls['email'].setValue('test@example.com');
    component.registerForm.controls['password'].setValue('123456');
    component.registerForm.controls['passwordAgain'].setValue('123456');
    component.register();

    expect(component.registrationSuccess).toBeTruthy();
    expect(component.errorMessage).toBe('');
  });

  it('should handle registration failure', () => {
    const mockError = { error: { message: 'Registration failed' } };
    authServiceMock.register.and.returnValue(throwError(() => mockError));
    component.registerForm.controls['email'].setValue('test@example.com');
    component.registerForm.controls['password'].setValue('123456');
    component.registerForm.controls['passwordAgain'].setValue('123456');
    component.register();

    expect(component.registrationSuccess).toBeFalsy();
    expect(component.errorMessage).toBe('Registration failed');
  });

  it('should not attempt registration if form is invalid', () => {
    component.registerForm.controls['email'].setValue(''); // Invalid due to missing email
    component.register();
    expect(authServiceMock.register.calls.any()).toBeFalse();
    expect(component.errorMessage).toBe('Form is invalid, registration aborted');
  });
});
