import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  registerForm!: FormGroup; // Use non-null assertion operator
  registrationSuccess!: boolean;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService, 
    private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  register() {
    if (this.registerForm.valid) {
      this.apiService.register(this.registerForm.value).subscribe({
        next: () => {
          this.registrationSuccess = true;
          this.errorMessage = '';
        },
        error: (error: any) => {
          this.registrationSuccess = false;
          if (error.status === 400) {
            this.errorMessage = 'Email already exists. Please try again with a different email.';
          } else if (error.status === 200) {
            this.registrationSuccess = true;
            this.errorMessage = '';
          } else {
            this.errorMessage = 'Error during registration. Please try again.';
          }
        }
      });
    } else {
      this.errorMessage ='Form is invalid, registration aborted';
    }
  }
}
