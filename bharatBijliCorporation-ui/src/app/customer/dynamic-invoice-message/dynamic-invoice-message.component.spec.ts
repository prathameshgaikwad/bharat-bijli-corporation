import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicInvoiceMessage } from './dynamic-invoice-message.component';

describe('DynamicInvoiceMessage', () => {
  let component: DynamicInvoiceMessage;
  let fixture: ComponentFixture<DynamicInvoiceMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicInvoiceMessage],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicInvoiceMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
