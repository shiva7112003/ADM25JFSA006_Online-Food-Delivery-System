import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../../Service/profile-service';
import { UserProfile } from '../../../Model/profile-model';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NavProfile } from '../../nav-profile/nav-profile';
import { Footer } from '../../footer/footer';

@Component({
  selector: 'app-profile',
  templateUrl: './profile-edit.html',
  styleUrls: ['./profile-edit.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavProfile, Footer]
})
export class ProfileEdit implements OnInit {
  profileForm!: FormGroup;
  isEditing = false;
  showSuccessMessage = false;
  successMessage = 'Profile updated successfully!';
  userProfile: UserProfile | null = null;

  constructor(
    public profileService: ProfileService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email, this.dotComValidator]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: ['', Validators.required]
    });

    this.profileService.getProfile().subscribe(profile => {
      this.userProfile = profile;
      if (profile) {
        this.profileForm.patchValue({ ...profile });
      }
    });

    this.profileService.fetchUserProfile().subscribe({
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching profile:', err);
      }
    });
  }

  toggleMode(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.userProfile) {
      this.profileForm.patchValue({ ...this.userProfile });
      this.profileForm.markAsPristine();
    }
    this.showSuccessMessage = false;
    this.profileService.error.next(null);
  }

  saveChanges(): void {
  if (this.profileForm.invalid) {
    this.profileForm.markAllAsTouched();
    return;
  }

  if (!this.userProfile) {
    this.profileService.error.next('Cannot save profile: User profile not loaded.');
    return;
  }

  const updatedProfile: UserProfile = {
    customer_id: this.userProfile.customer_id,
    ...this.profileForm.value
  };

  this.profileService.updateUserProfile(updatedProfile).subscribe({
    next: () => {
      this.isEditing = false;
      this.showSuccessMessage = true;
      setTimeout(() => this.showSuccessMessage = false, 1200);
      this.profileForm.markAsPristine();
    },
    error: (err: HttpErrorResponse) => {
      console.error('Error updating profile:', err);
    }
  });
}


  goToDashboard(): void {
    this.router.navigate(['/user-dashboard']);
  }

  dotComValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value && value.endsWith('.com') ? null : { dotComRequired: true };
  }
}
