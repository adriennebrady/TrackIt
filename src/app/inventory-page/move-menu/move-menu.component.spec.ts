import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveMenuComponent } from './move-menu.component';

describe('MoveMenuComponent', () => {
  let component: MoveMenuComponent;
  let fixture: ComponentFixture<MoveMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
