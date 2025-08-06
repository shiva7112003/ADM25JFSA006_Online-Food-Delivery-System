import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOptions } from './payment-options';

describe('PaymentOptions', () => {
  let component: PaymentOptions;
  let fixture: ComponentFixture<PaymentOptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentOptions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentOptions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
