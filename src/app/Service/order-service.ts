import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderDetail } from '../Model/order-detail';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private ordersSubject = new BehaviorSubject<OrderDetail[]>([]);
  private mockJsonPath = 'mocks/profile.json';

  constructor(private http: HttpClient) {
    this.loadCachedOrders();
  }

  // 🧪 Use mock JSON file instead of real API
  getOrdersFromApi(): Observable<OrderDetail[]> {
    return this.http.get<{ orders: OrderDetail[] }>(this.mockJsonPath).pipe(
      map(res => res.orders)
    );
  }

  // 🛒 Fetch & assign to BehaviorSubject internally
  fetchOrders(): void {
    this.getOrdersFromApi().subscribe({
      next: orders => {
        this.ordersSubject.next(orders);
        localStorage.setItem('userOrders', JSON.stringify(orders)); // 🔒 cache orders
      },
      error: err => console.error('❌ Failed to fetch orders:', err)
    });
  }

  // 💾 Restore from local storage if needed
  loadCachedOrders(): void {
  const stored = localStorage.getItem('userOrders');

  if (!stored) {
    console.warn('⚠️ No cached orders found in localStorage.');
    return;
  }

  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && this.ordersSubject.getValue().length === 0) {
      this.ordersSubject.next(parsed);
    } else {
      console.warn('⚠️ Cached data is not a valid order array.');
    }
  } catch (error) {
    console.error('❌ Failed to parse cached orders:', error);
  }
}

  // 🔗 Get the observable reference
  getOrders(): Observable<OrderDetail[]> {
    return this.ordersSubject.asObservable();
  }

  getOrderTotal(order: OrderDetail): number {
    return order.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  }
}
