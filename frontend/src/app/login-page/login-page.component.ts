import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService, 
    private router: Router) {
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.accessToken);
        this.router.navigate(['/profile']);
      },
      error: () => {
        this.errorMessage = 'Login was not successful. Please try again.';
      }
    });
  }
}
}