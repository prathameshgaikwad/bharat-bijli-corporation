import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsPanelComponent } from './actions-panel.component';

describe('ActionsPanelComponent', () => {
  let component: ActionsPanelComponent;
  let fixture: ComponentFixture<ActionsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
