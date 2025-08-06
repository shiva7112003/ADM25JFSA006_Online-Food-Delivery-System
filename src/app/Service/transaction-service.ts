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
  private storageKey = 'userTransactions';

  constructor(
    public http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  saveTransaction(transaction: any): Observable<any> {
    // Add timestamp and unique ID to transaction
    const transactionWithMeta = {
      ...transaction,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    // Simulate API call with localStorage for mock implementation
    return of(transactionWithMeta).pipe(
      delay(1000), // Simulate network delay
      tap(savedTransaction => {
        this.saveToLocalStorage(savedTransaction);
        console.log('✅ Transaction saved successfully:', savedTransaction);
      }),
      catchError(err => {
        console.error('❌ Failed to save transaction:', err);
        throw err;
      })
    );
  }

  private saveToLocalStorage(transaction: any): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const existingTransactions = this.getTransactionsFromStorage();
        existingTransactions.push(transaction);
        localStorage.setItem(this.storageKey, JSON.stringify(existingTransactions));
      } catch (e) {
        console.error('Failed to save transaction to localStorage:', e);
      }
    }
  }

  private getTransactionsFromStorage(): any[] {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.error('Failed to parse transactions from localStorage:', e);
        return [];
      }
    }
    return [];
  }

  getTransactions(): Observable<any[]> {
    const transactions = this.getTransactionsFromStorage();
    return of(transactions).pipe(delay(300));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}