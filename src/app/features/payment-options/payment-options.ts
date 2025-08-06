import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../Service/payment-service';
import { TransactionService } from '../../Service/transaction-service';
import { Router } from '@angular/router';
import { NavCheckout } from '../nav-checkout/nav-checkout';
import { Footer } from '../footer/footer';
 
 
@Component({
  selector: 'app-payment-options',
  standalone: true,
  imports: [CommonModule, FormsModule, NavCheckout, Footer],
  templateUrl: './payment-options.html',
  styleUrl: './payment-options.css'
})
export class PaymentOptions {
  selectedOption = '';
  upiId = '';
  couponCode = '';
  cardDetails = { number: '', expiry: '', cvv: '' };
  paymentSuccess = false;
  loadingPayment = false;
 
  cardBrandLogo = '';
  cardPreviewNumber = '';
  snackBar: any;
  errormsg = '';
 
  constructor(
    public paymentService: PaymentService,
    private transactionService: TransactionService,
    private router: Router
  ) {}
 
  getDeliveryCharge(): number {
    return this.paymentService.getDeliveryCharge();
  }
 
  applyCoupon(): void {
    this.errormsg = '';
    this.paymentService.applyCoupon(this.couponCode.trim().toUpperCase());
 
    if (this.paymentService.getDiscount() === 0) {
    this.errormsg = '❌ Invalid coupon or expired offer.';
  }
  }
 
  getTotal(): number {
    return this.paymentService.getTotal();
  }
 
  getCartTotal(): number {
    return this.paymentService.getCartTotal();
  }
 
  getDiscount(): number {
    return this.paymentService.getDiscount();
  }
 
  isValidUpiId(upiId: string): boolean {
    const regex = /^[\w.\-]{2,}@[a-zA-Z]{3,}$/;
    return regex.test(upiId.trim());
  }
 
  getUpiError(): string {
    if (!this.upiId.trim()) return '';
    return this.isValidUpiId(this.upiId)
      ? ''
      : 'Invalid UPI ID format. Use name@bank';
  }
 
  onCardInput(e: any): void {
    const raw = e.target.value.replace(/\D/g, '');
    this.cardDetails.number = raw.match(/.{1,4}/g)?.join(' ') || '';
    this.cardPreviewNumber = this.cardDetails.number;
    this.setCardBrandLogo(raw.substring(0, 6));
  }
 
  setCardBrandLogo(binPrefix: string): void {
    switch (true) {
      case binPrefix.startsWith('4'):
        this.cardBrandLogo = './image/visa.png';
        break;
      case binPrefix.startsWith('5'):
        this.cardBrandLogo = './image/master.png';
        break;
      case binPrefix.startsWith('3'):
        this.cardBrandLogo = './image/amex.jpg';
        break;
      default:
        this.cardBrandLogo = './image/unknown.jpg';
    }
  }
 
  isValidExpiry(date: string): boolean {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(date)) return false;
 
    const [month, year] = date.split('/').map(Number);
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear() % 100;
 
    return year > currentYear || (year === currentYear && month >= currentMonth);
  }
 
  payNow(): void {
    this.errormsg = '';
    this.paymentService.setPaymentMethod(this.selectedOption);
    const cardType = this.paymentService.getCardType(this.cardDetails.number);
    this.paymentService.setCardType(cardType);
 
    const cardDigits = this.cardDetails.number.replace(/\s/g, '');
    const cvv = this.cardDetails.cvv;
    const expiry = this.cardDetails.expiry;
 
 
    if (this.selectedOption === 'Card') {
      const isKnownCardType = ['Visa', 'MasterCard', 'Amex'].includes(cardType);
      const isCardLengthValid = cardDigits.length >= 13 && cardDigits.length <= 19;
      const isCvvValid = /^[0-9]{3,4}$/.test(cvv);
      const isExpiryValid = this.isValidExpiry(expiry);
 
      if (!isKnownCardType) {
        this.errormsg = '❌ Unrecognized card type. Use Visa, MasterCard, or Amex.';
      } else if (!isCardLengthValid) {
        this.errormsg = '❌ Card number must be between 13 and 19 digits.';
      } else if (!isExpiryValid) {
        this.errormsg = '❌ Invalid expiry date.';
      } else if (!isCvvValid) {
        this.errormsg = '❌ CVV must be 3–4 digits.';
      }
 
      if (this.errormsg) {
        this.snackBar?.open(this.errormsg, 'Close', { duration: 4000 });
        return;
      }
    }
 
    if (this.selectedOption === 'UPI' && !this.isValidUpiId(this.upiId)) {
      this.errormsg += 'Invalid UPI format. Use name@bank.';
      this.snackBar?.open(this.errormsg, 'Close', { duration: 4000 });
      return;
    }
 
    if (!['Card', 'UPI', 'COD'].includes(this.selectedOption)) {
      this.errormsg += 'No valid payment method selected.';
      this.snackBar?.open(this.errormsg, 'Close', { duration: 4000 });
      return;
    }
 
    this.loadingPayment = true;
    const transaction = this.paymentService.getTransactionSummary();
 
    this.transactionService.saveTransaction(transaction).subscribe({
      next: () => {
        this.paymentSuccess = true;
          this.router.navigate(['/payment-summary'], {
            state: { data: transaction },
        }).then(success => console.log('Navigation success:', success));

      },
      error: () => {
        this.loadingPayment = false;
        this.snackBar?.open('❌ Transaction failed. Try again.', 'Close', {
          duration: 3000,
        });
      }
    });
  }
}