import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePaymentPageComponent } from './invoice-payment-page.component';

describe('InvoicePaymentPageComponent', () => {
  let component: InvoicePaymentPageComponent;
  let fixture: ComponentFixture<InvoicePaymentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicePaymentPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoicePaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
