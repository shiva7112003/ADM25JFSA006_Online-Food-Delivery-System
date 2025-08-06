import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavCheckout } from './nav-checkout';

describe('NavCheckout', () => {
  let component: NavCheckout;
  let fixture: ComponentFixture<NavCheckout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavCheckout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavCheckout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
