import { Component, OnDestroy } from '@angular/core';
import { OrderDetail } from '../../Model/order-detail';
import { OrderService } from '../../Service/order-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavProfile } from '../nav-profile/nav-profile';
import { Footer } from '../footer/footer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, NavProfile, Footer],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css'
})
export class OrderHistory implements OnDestroy {
  orderList: OrderDetail[] = [];
  private subscription: Subscription | null = null;

  constructor(private orderService: OrderService, private router: Router) {
    this.orderService.loadCachedOrders();
    this.orderService.fetchOrders();
    this.subscription = this.orderService.getOrders().subscribe(orders => {
      this.orderList = orders;
      console.log('👀 Order list content:', orders);
    });
  }

  backToDashboard(): void {
    this.router.navigate(['/user-dashboard']);
  }

  getOrderTotal(order: OrderDetail): number {
    return order.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
