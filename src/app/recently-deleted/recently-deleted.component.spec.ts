import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlyDeletedComponent } from './recently-deleted.component';

import { MatDialog } from '@angular/material/dialog';

describe('RecentlyDeletedComponent', () => {
  let component: RecentlyDeletedComponent;
  let fixture: ComponentFixture<RecentlyDeletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentlyDeletedComponent ],
      providers: [
        { provide: MatDialog, useValue: {} }
      ]
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
