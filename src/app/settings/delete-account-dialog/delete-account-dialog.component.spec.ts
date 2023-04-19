import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAccountDialogComponent } from './delete-account-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('DeleteAccountDialogComponent', () => {
  let component: DeleteAccountDialogComponent;
  let fixture: ComponentFixture<DeleteAccountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteAccountDialogComponent ],
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

    fixture = TestBed.createComponent(DeleteAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display add item dialog title', () => {
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Delete Account?');
  });

  it('should call cancel() when cancel button is clicked', () => {
    fixture.detectChanges();
    spyOn(component, 'cancel');
    const cancelButton = fixture.debugElement.query(By.css('.cancelButton')).nativeElement;
    cancelButton.click();
    expect(component.cancel).toHaveBeenCalled();
  });

  it('should disable delete button element when input fields are empty', () => {
    const deleteButton = fixture.debugElement.query(By.css('.renameButton')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('input[name=password]')).nativeElement;
    const confirmPasswordInput = fixture.debugElement.query(By.css('input[name=confirmpass]')).nativeElement;

    passwordInput.value = '';
    passwordInput.dispatchEvent(new Event('input'));
    confirmPasswordInput.value = '';
    confirmPasswordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(deleteButton.disabled).toBeTruthy();
  });

  it('should call deleteAccount() when delete button is clicked', () => {
    spyOn(component, 'deleteAccount');
    const deleteButton = fixture.debugElement.query(By.css('.renameButton')).nativeElement;
    deleteButton.click();
    expect(component.deleteAccount).toHaveBeenCalled();
  });

  it('should enable delete when input fields are filled', () => {
    const passwordInput = fixture.debugElement.query(By.css('input[name="password"]')).nativeElement;
    const confirmPasswordInput = fixture.debugElement.query(By.css('input[name="confirmpass"]')).nativeElement;
    const renameButton = fixture.debugElement.query(By.css('.renameButton')).nativeElement;
    
    passwordInput.value = 'password';
    passwordInput.dispatchEvent(new Event('input'));
    confirmPasswordInput.value = 'password';    
    confirmPasswordInput.dispatchEvent(new Event('input'));
    
    fixture.detectChanges();
    expect(renameButton.disabled).toBeFalsy();
  });
});
