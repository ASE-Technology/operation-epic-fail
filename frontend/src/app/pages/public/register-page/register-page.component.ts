import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../../services/authentication.service';
import { PasswordMismatchValidator } from '../../../shared/validators/password-mismatch.validator';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  registerForm!: FormGroup; 
  registrationSuccess!: boolean;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService, 
    private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      passwordAgain: ['', [Validators.required]],
    }, {
      validators: PasswordMismatchValidator('password', 'passwordAgain')
    });
  }

  register() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.getRawValue();
      const data = {
        email: email,
        password: password
      };

      this.authenticationService.register(data).subscribe({
        next: () => {
          this.registrationSuccess = true;
          this.errorMessage = '';
        },
        error: (error: any) => {
          this.registrationSuccess = false;
          if (error.error) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = error.message;
          }
        }
      });
    } else {
      this.errorMessage ='Form is invalid, registration aborted';
    }
  }
}
