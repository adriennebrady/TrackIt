import { RenameDialogComponent } from './rename-dialog.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

describe('RenameDialogComponent', () => {
  let component: RenameDialogComponent;
  let fixture: ComponentFixture<RenameDialogComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenameDialogComponent ],
      imports: [
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]  
    })
  .compileComponents();

    fixture = TestBed.createComponent(RenameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    el = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display rename dialog title', () => {
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Rename');
  });

  /*
  it('should enable rename button with some value', () => {
    component.data.name = "Hello World";
    fixture.detectChanges();
    const renameButton = fixture.debugElement.query(By.css('.renameButton')).nativeElement;
    expect(renameButton.disable).toBeTruthy();
  });

  it('should disable rename button with null value', () => {
    component.data.name = "";
    fixture.detectChanges();
    const renameButton = fixture.debugElement.query(By.css('.renameButton')).nativeElement;
    expect(renameButton.disable).toBeTruthy();
  });
  */
  
  it('should call cancel() when cancel button is clicked', () => {
    fixture.detectChanges();
    spyOn(component, 'cancel');
    const cancelButton = fixture.debugElement.query(By.css('.cancelButton')).nativeElement;
    cancelButton.click();
    expect(component.cancel).toHaveBeenCalled();
  });
});
