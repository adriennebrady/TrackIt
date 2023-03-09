import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvContainerComponent } from './inv-container.component';

describe('InvContainerComponent', () => {
  let component: InvContainerComponent;
  let fixture: ComponentFixture<InvContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
