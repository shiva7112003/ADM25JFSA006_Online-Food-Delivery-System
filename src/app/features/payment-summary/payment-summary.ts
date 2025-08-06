import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavCheckout } from '../nav-checkout/nav-checkout';
import { Footer } from '../footer/footer';
 
@Component({
  selector: 'app-payment-summary',
  imports: [FormsModule, CommonModule, NavCheckout, Footer],
  templateUrl: './payment-summary.html',
  styleUrl: './payment-summary.css'
})
export class PaymentSummary implements OnInit{
  transaction: any;
 
  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.transaction = nav?.extras?.state?.['data'];
  }
 
  ngOnInit(): void { }
 
  trackOrder(): void {
    alert('🛵 Order Tracking Coming Soon!');
  }
 
}