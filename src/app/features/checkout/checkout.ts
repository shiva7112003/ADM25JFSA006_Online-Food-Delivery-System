import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutService } from '../../Service/checkout-service';
import { Address, CartItem } from '../../Service/checkout-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavCheckout } from '../nav-checkout/nav-checkout';
import { Footer } from '../footer/footer';
 
@Component({
  selector: 'app-checkout',
  imports: [FormsModule, CommonModule, NavCheckout, Footer],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {
  address: Address = {
    name: '',
    line1: '',
    line2: '',
    city: '',
    pincode: ''
  };
 
  constructor(
    private router: Router,
    public checkoutService: CheckoutService
  ) {}
 
  proceedToPayment(): void {
    this.checkoutService.setAddress(this.address);
    this.router.navigate(['/payment-options']);
  }
 
  getCartItems(): CartItem[] {
    return this.checkoutService.getCartItems();
  }
 
  getCartTotal(): number {
    return this.checkoutService.getTotal();
  }
 
 
}