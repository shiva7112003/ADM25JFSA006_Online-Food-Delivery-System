import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nav-checkout',
  imports: [],
  templateUrl: './nav-checkout.html',
  styleUrl: './nav-checkout.css'
})
export class NavCheckout {
  constructor(private router: Router) {}
 
  goToProfile() : void {
    this.router.navigate(['/user-dashboard']);  
  }
}