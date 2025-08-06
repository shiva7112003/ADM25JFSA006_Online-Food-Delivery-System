import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  apiUrl = 'http://localhost:3000/transaction';
 
  constructor(public http: HttpClient) {}
 
  saveTransaction(transaction: any) {
    // transaction.id = Date.now()
    return this.http.post(this.apiUrl, transaction);
  }
}