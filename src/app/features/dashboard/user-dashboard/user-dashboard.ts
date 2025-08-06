import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { OrderDetail } from '../../../Model/order-detail';
import { UserProfile } from '../../../Model/profile-model';
import { ProfileService } from '../../../Service/profile-service';
import { OrderService } from '../../../Service/order-service';
import { NavProfile } from '../../nav-profile/nav-profile';
import { Footer } from '../../footer/footer';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, NavProfile, Footer],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboard implements OnInit, OnDestroy {
  userProfile: UserProfile | null = null;
  orderList: OrderDetail[] = [];

  totalOrders = 0;
  deliveredOrders = 0;
  pendingOrders = 0;

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    public profileService: ProfileService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
  this.orderService.fetchOrders(); // ✅ Ensure orders are loaded
  this.loadOrders();
  this.loadUserProfile();
}


  private loadOrders(): void {
    const ordersSub = this.orderService.getOrdersFromApi().subscribe(orders => {
      const safeOrders = orders ?? [];

      console.log('📊 Orders received in dashboard:', safeOrders);

      this.orderList = safeOrders;
      this.orderService.setOrders(safeOrders); // ✅ Use public setter method


      this.totalOrders = safeOrders.length;
      this.deliveredOrders = safeOrders.filter(o => o.status === 'Delivered').length;
      this.pendingOrders = safeOrders.filter(o => o.status === 'Pending').length;
    });

    this.subscriptions.push(ordersSub);
  }

  private loadUserProfile(): void {
    const profileSub = this.profileService.getProfile().subscribe(profile => {
      this.userProfile = profile;

      if (!profile) {
        const fetchProfileSub = this.profileService.fetchUserProfile().subscribe();
        this.subscriptions.push(fetchProfileSub);
      }
    });

    this.subscriptions.push(profileSub);
  }

  navigateToOrders(): void {
    this.router.navigate(['/order-history']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile-edit']);
  }

  getOrderTotal(order: OrderDetail): number {
    return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get profile(): UserProfile | null {
    return this.userProfile;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
