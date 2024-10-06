import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletPaymentComponent } from './wallet-payment.component';

describe('WalletPaymentComponent', () => {
  let component: WalletPaymentComponent;
  let fixture: ComponentFixture<WalletPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
