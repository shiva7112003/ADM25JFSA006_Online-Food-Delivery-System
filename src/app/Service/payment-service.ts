import { Injectable } from '@angular/core';
import { CheckoutService } from './checkout-service';
 
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
 
  private deliveryCharge = 50;
  private discount = 0;
  private coupon = '';
  private selectedMethod = '';
  private cardType = '';
  private transactionId = '';
  constructor(private CheckoutService: CheckoutService) {}
 
  getDeliveryCharge():number{
    if (this.getTotal() >= 200) {
      return 0;
    }
    return this.deliveryCharge;
  }
 
  getTotal(): number {
    return this.CheckoutService.getTotal();
  }
  getCartTotal(): number {
    return this.getTotal() + this.getDeliveryCharge() - this.discount;
  }
 
  applyCoupon(code: string):void {
    const cartTotal = this.getTotal();
 
    const couponRules: { [code: string]: { discount: number; minTotal: number } } = {
      'SPICY100': { discount: 100, minTotal: 500 },
      'WELCOME25': { discount: 25, minTotal: 0 },
      'FOOD10':    { discount: 10, minTotal: 250 },
      'BIGSAVE75': { discount: 75, minTotal: 400 }
    };
 
    const rule = couponRules[code];
    if (rule && cartTotal >= rule.minTotal) {
      this.discount = rule.discount;
      this.coupon = code;
    } else {
      this.discount = 0;
      this.coupon = '';
    }
  }
 
  getCoupon() {
    return this.coupon;
  }
 
  getDiscount(): number {
    return this.discount;
  }
 
  setPaymentMethod(method: string) {
    this.selectedMethod = method;
  }
 
  getPaymentMethod(): string {
    return this.selectedMethod;
  }
 
  setCardType(type: string) {
    this.cardType = type;
  }
 
  // getStoredCardType(): string {
  //   return this.cardType;
  // }
 
  generateTransactionId(): string {
    this.transactionId = 'TXN-' + Date.now();
    return this.transactionId;
  }
 
  getTransactionSummary() {
    return {
      transactionId : this.transactionId || this.generateTransactionId(),
      method: this.selectedMethod,
      cardType: this.cardType,
      coupon: this.coupon,
      amount: this.getCartTotal()
    };
  }
 
  getCardType(number: string): string {
    const raw = number.replace(/\s/g, '');
    if (/^4/.test(raw)) return 'Visa';
    if (/^5[1-5]/.test(raw)) return 'MasterCard';
    if (/^3[47]/.test(raw)) return 'Amex';
    return 'Unknown';
  }
}