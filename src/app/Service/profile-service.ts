import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserProfile } from '../Model/profile-model';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { catchError, delay, tap, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);
  public isLoading = new BehaviorSubject<boolean>(false);
  public error = new BehaviorSubject<string | null>(null);

  // Fixed endpoint to use the mock data correctly
  private mockJsonPath = './mocks/profile.json';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadCachedProfile();
    // If no cached profile exists, automatically fetch from API
    if (!this.profileSubject.getValue()) {
      console.log('👤 No cached profile found, fetching from API...');
      this.fetchUserProfile().subscribe({
        next: () => console.log('👤 Profile auto-fetch completed'),
        error: (err) => console.error('❌ Profile auto-fetch failed:', err)
      });
    }
  }

  setProfile(profile: UserProfile): void {
    this.profileSubject.next(profile);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('userProfile', JSON.stringify(profile));
    }
  }

  private loadCachedProfile(): void {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('userProfile');
      if (stored) {
        try {
          this.profileSubject.next(JSON.parse(stored));
        } catch (e) {
          console.error('Error parsing cached user profile:', e);
          localStorage.removeItem('userProfile');
        }
      }
    }
  }

  fetchUserProfile(): Observable<UserProfile> {
    this.isLoading.next(true);
    this.error.next(null);

    const cachedProfile = this.profileSubject.getValue();
    if (cachedProfile) {
      return of(cachedProfile).pipe(
        delay(100),
        tap(() => this.isLoading.next(false))
      );
    } else if (isPlatformBrowser(this.platformId)) {
      return this.http.get<{ profile: UserProfile }>(this.mockJsonPath).pipe(
        delay(1000),
        map(res => res.profile),
        tap(profile => {
          this.setProfile(profile);
          this.isLoading.next(false);
        }),
        catchError((err: HttpErrorResponse) => {
          this.isLoading.next(false);
          const errorMessage = `Failed to fetch profile from JSON: ${err.status} - ${err.message || err.statusText}`;
          this.error.next(errorMessage);
          console.error(errorMessage, err);
          return throwError(() => new Error(errorMessage));
        })
      );
    } else {
      // For SSR, return a default profile or empty state
      this.isLoading.next(false);
      return of({
        customer_id: 0,
        name: 'Loading...',
        email: '',
        phone: '',
        address: ''
      });
    }
  }

  updateUserProfile(updatedProfile: UserProfile): Observable<UserProfile> {
    this.isLoading.next(true);
    this.error.next(null);

    // For mock implementation, we'll simulate an update by updating the cache
    // In a real app, this would be a PUT/PATCH request to the server
    return of(updatedProfile).pipe(
      delay(500), // Simulate network delay
      tap(profile => {
        this.setProfile(profile);
        this.isLoading.next(false);
      }),
      catchError((err: HttpErrorResponse) => {
        this.isLoading.next(false);
        const errorMessage = `Failed to update profile: ${err.status} - ${err.message || 'Unknown error'}`;
        this.error.next(errorMessage);
        console.error(errorMessage, err);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getProfile(): Observable<UserProfile | null> {
    return this.profileSubject.asObservable();
  }
}
