import { Injectable } from '@angular/core';
 
export interface Address {
  name : string;
  line1: string;
  line2: string;
  city: string;
  pincode: string;
}
 
export interface CartItem {
  name: string;
  price: number;
}
 
@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private address: Address = {
    name: '',
    line1: '',
    line2: '',
    city: '',
    pincode: ''
  };
 
  private cartItems: CartItem[] = [
    { name: 'Paneer Tikka', price: 50 },
    { name: 'Garlic Naan', price: 60 },
    { name: 'Masala Chai', price: 40 }
  ];
 
  setAddress(address: Address): void {
    this.address = address;
  }
 
  getAddress(): Address {
    return this.address;
  }
 
  setCartItems(items: CartItem[]): void {
    this.cartItems = items;
  }
 
  getCartItems(): CartItem[] {
    return this.cartItems;
  }
 
  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }
 
  clearCheckout(): void {
    this.cartItems = [];
    this.address = {
      name: '',
      line1: '',
      line2: '',
      city: '',
      pincode: ''
    };
  }
}