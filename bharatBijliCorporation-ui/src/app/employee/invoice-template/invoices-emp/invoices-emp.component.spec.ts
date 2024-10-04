import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpInvoicesComponent } from './invoices-emp.component';

describe('EmpInvoicesComponent', () => {
  let component: EmpInvoicesComponent;
  let fixture: ComponentFixture<EmpInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpInvoicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
