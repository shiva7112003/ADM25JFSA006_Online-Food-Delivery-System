import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderDetail } from '../Model/order-detail';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private ordersSubject = new BehaviorSubject<OrderDetail[]>([]);
  private mockJsonPath = 'mocks/orders.json'; // ✅ Renamed for clarity

  constructor(private http: HttpClient) {}

  // 🧪 Load mock orders from JSON file
  getOrdersFromApi(): Observable<OrderDetail[]> {
    return this.http.get<{ orders: OrderDetail[] }>(this.mockJsonPath).pipe(
      map(res => res.orders)
    );
  }

  // 🛒 Fetch and assign to BehaviorSubject
  fetchOrders(): void {
    this.getOrdersFromApi().subscribe({
      next: orders => this.ordersSubject.next(orders),
      error: err => {
        console.error('❌ Failed to fetch orders:', err);
        // Optionally: retry or notify user
      }
    });
  }

  // 💾 Load cached orders from localStorage
  loadCachedOrders(): void {
    const stored = localStorage.getItem('userOrders');
    try {
      if (stored && this.ordersSubject.getValue().length === 0) {
        const parsed = JSON.parse(stored) as OrderDetail[];
        this.ordersSubject.next(parsed);
      }
    } catch (e) {
      console.error('⚠️ Failed to parse cached orders:', e);
    }
  }

  // 🔗 Observable reference to orders
  getOrders(): Observable<OrderDetail[]> {
    return this.ordersSubject.asObservable();
  }

  // 🔄 Set orders manually
  setOrders(orders: OrderDetail[]): void {
  this.ordersSubject.next(orders);
}


  // 🔍 Get a specific order by ID
  getOrderById(id: number): Observable<OrderDetail | undefined> {
    return this.getOrders().pipe(
      map(orders => orders.find(order => order.id === id))
    );
  }

  // 🧮 Calculate total for an order
  getOrderTotal(order: OrderDetail): number {
    return order.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  }
}
