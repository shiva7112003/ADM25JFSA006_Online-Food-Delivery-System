import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderDetail } from '../../../Model/order-detail';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserProfile } from '../../../Model/profile-model';
import { ProfileService } from '../../../Service/profile-service';
import { OrderService } from '../../../Service/order-service';
import { NavProfile } from '../../nav-profile/nav-profile';
import { Footer } from '../../footer/footer';
import { Subscription } from 'rxjs';

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
  isLoadingOrders = true;

  totalOrders = 0;
  deliveredOrders = 0;
  pendingOrders = 0;
  recentOrders: OrderDetail[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    public profileService: ProfileService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    console.log('🏠 UserDashboard ngOnInit called');
    
    // Load cached orders first for immediate display
    this.orderService.loadCachedOrders();
    
    // Always fetch fresh orders to ensure latest data
    this.orderService.fetchOrders();

    const ordersSub = this.orderService.getOrders().subscribe(orders => {
      console.log('📦 Orders received in dashboard:', orders);
      this.orderList = orders;
      this.isLoadingOrders = false;
      this.updateOrderStats();
    });
    this.subscriptions.push(ordersSub);

    const profileSub = this.profileService.getProfile().subscribe(profile => {
      console.log('👤 Profile received in dashboard:', profile);
      this.userProfile = profile;

      // If profile is missing or partially loaded, fetch it
      if (!profile) {
        console.log('👤 Fetching profile data...');
        const fetchProfileSub = this.profileService.fetchUserProfile().subscribe({
          next: (fetchedProfile) => {
            console.log('👤 Profile fetched successfully:', fetchedProfile);
          },
          error: (error) => {
            console.error('❌ Error fetching profile:', error);
          }
        });
        this.subscriptions.push(fetchProfileSub);
      }
    });

    this.subscriptions.push(profileSub);
  }

  private updateOrderStats(): void {
    console.log('📊 Updating order stats with orderList:', this.orderList);
    
    this.totalOrders = this.orderList.length;
    this.deliveredOrders = this.orderList.filter(o => o.status === 'Delivered').length;
    this.pendingOrders = this.orderList.filter(o => o.status === 'Pending').length;

    this.recentOrders = this.orderList
      .slice()
      .sort((a, b) => {
        // Handle cases where orderDate might be missing
        const dateA = a.orderDate ? new Date(a.orderDate).getTime() : 0;
        const dateB = b.orderDate ? new Date(b.orderDate).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 2);
      
    console.log('📊 Stats updated:', {
      total: this.totalOrders,
      delivered: this.deliveredOrders,
      pending: this.pendingOrders,
      recent: this.recentOrders
    });
  }

  navigateToOrders(): void {
    this.router.navigate(['/order-history']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile-edit']);
  }

  getOrderTotal(order: OrderDetail): number {
    return this.orderService.getOrderTotal(order);
  }

  get profile(): UserProfile | null {
    return this.userProfile;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
