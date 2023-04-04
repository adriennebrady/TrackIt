import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecountDialogComponent } from './recount-dialog.component';

describe('RecountDialogComponent', () => {
  let component: RecountDialogComponent;
  let fixture: ComponentFixture<RecountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecountDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
