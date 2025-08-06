import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  // For mock implementation, we'll use localStorage to simulate saving transactions
  private storageKey = 'http://localhost:300/transaction';

  constructor(
    public http: HttpClient
  ) {}

  saveTransaction(transaction: any): Observable<any> {
    return this.http.post(this.storageKey,transaction);
  }
}