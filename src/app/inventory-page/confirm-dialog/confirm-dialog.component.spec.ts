import { ConfirmDialogComponent } from './confirm-dialog.component';

import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  const mockDialogRef = {
    open: jasmine.createSpy('open')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDialogComponent ],
      imports: [
        MatDialogModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {
          close: (dialogResult: any) => { }
        } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display confirm dialog title', () => {
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Confirm');
  });
});
