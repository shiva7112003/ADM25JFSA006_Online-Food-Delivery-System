import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserProfile } from '../Model/profile-model';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, tap, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);
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
        this.profileSubject.next(JSON.parse(stored));
      }
    }
  }

  fetchUserProfile(): Observable<UserProfile> {
    const cachedProfile = this.profileSubject.getValue();
    if (cachedProfile) {
      return of(cachedProfile).pipe(delay(100));
    } else {
      return this.http.get<{ profile: UserProfile }>(this.mockJsonPath).pipe(
        delay(1000),
        map(res => res.profile),
        tap(profile => this.setProfile(profile))
      );
    }
  }

  updateUserProfile(updatedProfile: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.mockJsonPath, updatedProfile).pipe(
      tap(profile => this.setProfile(profile))
    );
  }

  getProfile(): Observable<UserProfile | null> {
    return this.profileSubject.asObservable();
  }
}
