import { Routes } from '@angular/router';
import { UserDashboard } from './features/dashboard/user-dashboard/user-dashboard';
import { ProfileEdit } from './features/profile/profile-edit/profile-edit';
import { OrderHistory } from './features/order-history/order-history';
import { Checkout } from './features/checkout/checkout';
import { PaymentOptions } from './features/payment-options/payment-options';
import { PaymentSummary } from './features/payment-summary/payment-summary';

export const routes: Routes = [
  { path: 'user-dashboard', component: UserDashboard, title: 'User Dashboard' },
  { path: '', component: Checkout, title: 'checkout' },
  {path:'checkout',component:Checkout,title:'checkout'},
  { path: 'payment-options', component: PaymentOptions, title: 'Payment Options' },
  { path: 'payment-summary', component: PaymentSummary, title: 'Payment Summary' },
  { path: 'profile-edit', component: ProfileEdit, title: 'Edit Profile' },
  { path: 'order-history', component: OrderHistory, title: 'Order History' },
  
];
