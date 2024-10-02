import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingDuesComponent } from './pending-dues.component';

describe('PendingDuesComponent', () => {
  let component: PendingDuesComponent;
  let fixture: ComponentFixture<PendingDuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingDuesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
