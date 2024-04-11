import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordMismatchValidator } from '../../../shared/validators/password-mismatch.validator';
import { ValidatorErrors } from '../../../shared/constants/validator-errors..constant';
import { AuthenticationService } from '../../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  validatorErrors = ValidatorErrors;

  profileForm!: FormGroup;
  isSubmitted = false;
  errorMessage = '';

  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,) {
  }

  ngOnInit(): void {
    this.authenticationService.getProfile().subscribe(profile => {
      this.bouildProfileForm(profile);
    })
  }

  onSubmit() {
    this.isSubmitted = true;
    if (!this.profileForm.valid) return;

    const { email, currentPassword, newPassword } = this.profileForm.getRawValue();
    const data = {
      email: email,
      newPassword: newPassword,
      oldPassword: currentPassword
    };

    this.authenticationService.updateProfile(data).subscribe({
      // Login again in order to update the token
      next: _ => this.authenticationService.login({email: email, password: newPassword}).subscribe(_ => {
        localStorage.setItem('token', _.accessToken);
        this.toastrService.success("Profile updated successfully!", "Profile update")
      }),
      error: (error: any) => {
        if (error.error) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = error.message;
        }
      }
    });
  }

  private bouildProfileForm(profile: any) {
    this.profileForm = this.formBuilder.group({
      email: [profile.email, Validators.required],
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      newPasswordAgain: ['', Validators.required],
    }, {
      validators: PasswordMismatchValidator('newPassword', 'newPasswordAgain')
    });
  }
}
