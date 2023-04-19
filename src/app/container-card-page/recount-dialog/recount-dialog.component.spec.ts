import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecountDialogComponent } from './recount-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('RecountDialogComponent', () => {
  let component: RecountDialogComponent;
  let fixture: ComponentFixture<RecountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecountDialogComponent ],
      imports: [
        MatDialogModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct dialog title', () => {
    const dialogTitle = fixture.nativeElement.querySelector('h1');
    expect(dialogTitle.textContent).toContain('Update Item Count');
  });

  it('should disable update button if the form is invalid', () => {
    component.data.count = '';
    fixture.detectChanges();
    const updateButton = fixture.nativeElement.querySelector('.recountButton');
    expect(updateButton.disabled).toBeTruthy();
  });

  it('should enable update button if the form is valid', () => {
    const inputField = fixture.nativeElement.querySelector('input[name="count"]');
    expect(inputField).toBeDefined();

    const updateButton = fixture.nativeElement.querySelector('.recountButton');
    expect(updateButton).toBeDefined();

    inputField.value = '3';
    inputField.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(updateButton.disabled).toBeFalsy();
  });

  it('should call updateCount() if update button is clicked', () => {
    spyOn(component, 'updateCount');
    const button = fixture.nativeElement.querySelector('.recountButton');
    button.click();
    expect(component.updateCount).toHaveBeenCalled();
  });

  it('should call cancel() if cancel button is clicked', () => {
    spyOn(component, 'cancel');
    const button = fixture.nativeElement.querySelector('.cancelButton');
    button.click();
    expect(component.cancel).toHaveBeenCalled();
  });
});
