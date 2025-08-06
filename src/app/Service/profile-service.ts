import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserProfile } from '../Model/profile-model';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { catchError, delay, tap, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);
  public isLoading = new BehaviorSubject<boolean>(false);
  public error = new BehaviorSubject<string | null>(null);

  private mockJsonPath = 'http://localhost:3000/profile';

  constructor(private http: HttpClient) {
    this.loadCachedProfile();
  }

  setProfile(profile: UserProfile): void {
    this.profileSubject.next(profile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('userProfile', JSON.stringify(profile));
    }
  }

  private loadCachedProfile(): void {
    if (typeof window !== 'undefined') {
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
    } else {
      return this.http.get<UserProfile>(this.mockJsonPath).pipe(
        delay(1000),
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
    }
  }

  updateUserProfile(updatedProfile: UserProfile): Observable<UserProfile> {
    this.isLoading.next(true);
    this.error.next(null);

    return this.http.put<UserProfile>(this.mockJsonPath, updatedProfile).pipe(
      tap(profile => {
        this.setProfile(profile);
        this.isLoading.next(false);
      }),
      catchError((err: HttpErrorResponse) => {
        this.isLoading.next(false);
        const errorMessage = `Failed to update profile via JSON Server: ${err.status} - ${err.message || 'Unknown error'}`;
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
