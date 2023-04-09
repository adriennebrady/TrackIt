import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlyDeletedComponent } from './recently-deleted.component';

describe('RecentlyDeletedComponent', () => {
  let component: RecentlyDeletedComponent;
  let fixture: ComponentFixture<RecentlyDeletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentlyDeletedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentlyDeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
