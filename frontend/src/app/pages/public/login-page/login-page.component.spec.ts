import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginPageComponent } from './login-page.component';
import { AuthenticationService } from '../../../services/authentication.service';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthenticationService', ['login']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule, 
        LoginPageComponent
      ],
      providers: [
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form with empty fields', () => {
    expect(component.loginForm).toBeTruthy();
    expect(component.loginForm.get('email')?.value).toEqual('');
    expect(component.loginForm.get('password')?.value).toEqual('');
    expect(component.loginForm.valid).toBeFalsy(); // Form should be initially invalid
  });

  it('should require email and password', () => {
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('123456');
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should handle successful login', () => {
    authServiceMock.login.and.returnValue(of({ accessToken: 'fake-token' }));
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password');
    component.login();
    expect(authServiceMock.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/portal/dashboard']);
  });

  it('should handle login failure', () => {
    authServiceMock.login.and.returnValue(throwError(() => new Error('Login failed')));
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password');
    component.login();
    expect(component.errorMessage).toBe('Login was not successful. Please try again.');
  });
});
