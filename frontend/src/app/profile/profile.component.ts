import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { PasswordMismatchValidator } from '../shared/validators/password-mismatch.validator';
import { ValidatorErrors } from '../shared/constants/validator-errors..constant';

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

  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.profileService.getProfile().subscribe(profile => {
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

    this.profileService.updateProfile(data).subscribe();
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
