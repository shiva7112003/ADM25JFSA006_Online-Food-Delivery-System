import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderDetail } from '../Model/order-detail';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private ordersSubject = new BehaviorSubject<OrderDetail[]>([]);
  // Fixed endpoint to use correct path
  private mockJsonPath = 'mocks/profile.json';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Initialize orders on service creation
    this.initializeOrders();
  }

  // Initialize orders by loading from cache or fetching fresh data
  private initializeOrders(): void {
    console.log('🚀 Initializing OrderService...');
    this.loadCachedOrders();
    // Also fetch fresh orders in the background
    this.fetchOrders();
  }

  // Use mock JSON file instead of real API
  getOrdersFromApi(): Observable<OrderDetail[]> {
    if (!isPlatformBrowser(this.platformId)) {
      // For SSR, return empty array
      console.log('⚡ SSR detected, returning empty orders');
      return of([]);
    }

    console.log('🌐 Fetching orders from:', this.mockJsonPath);
    return this.http.get<{ orders: OrderDetail[] }>(this.mockJsonPath).pipe(
      map(res => {
        console.log('📋 Raw API response:', res);
        return res.orders;
      }),
      catchError(err => {
        console.error('Failed to fetch orders from API:', err);
        // Return cached orders or empty array if API fails
        const cachedOrders = this.getOrdersFromCache();
        console.log('🔄 Falling back to cached orders:', cachedOrders);
        return of(cachedOrders);
      })
    );
  }

  // Fetch & assign to BehaviorSubject internally
  fetchOrders(): void {
    console.log('🔄 Fetching orders from API...');
    this.getOrdersFromApi().subscribe({
      next: orders => {
        console.log('✅ Orders fetched successfully:', orders);
        this.ordersSubject.next(orders);
        this.cacheOrders(orders);
      },
      error: err => {
        console.error('❌ Failed to fetch orders:', err);
        // Load cached orders as fallback
        this.loadCachedOrders();
      }
    });
  }

  // Cache orders to localStorage
  private cacheOrders(orders: OrderDetail[]): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('userOrders', JSON.stringify(orders));
      } catch (e) {
        console.error('Failed to cache orders:', e);
      }
    }
  }

  // Get orders from localStorage
  private getOrdersFromCache(): OrderDetail[] {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const stored = localStorage.getItem('userOrders');
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.error('Failed to parse cached orders:', e);
        return [];
      }
    }
    return [];
  }

  // Restore from local storage if needed
  loadCachedOrders(): void {
    const cachedOrders = this.getOrdersFromCache();
    console.log('💾 Loading cached orders:', cachedOrders);
    if (cachedOrders.length > 0) {
      console.log('✅ Setting cached orders to subject');
      this.ordersSubject.next(cachedOrders);
    } else {
      console.log('📭 No cached orders found');
    }
  }

  // Get the observable reference
  getOrders(): Observable<OrderDetail[]> {
    return this.ordersSubject.asObservable();
  }

  getOrderTotal(order: OrderDetail): number {
    return order.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  }
}
