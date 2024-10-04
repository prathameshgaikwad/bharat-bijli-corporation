import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkCustComponent } from './bulk-cust.component';

describe('BulkCustComponent', () => {
  let component: BulkCustComponent;
  let fixture: ComponentFixture<BulkCustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkCustComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkCustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
