import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerActionsMenuComponent } from './customer-actions-menu.component';

describe('CustomerActionsMenuComponent', () => {
  let component: CustomerActionsMenuComponent;
  let fixture: ComponentFixture<CustomerActionsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerActionsMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerActionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
