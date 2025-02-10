import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDialogComponent } from './item-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { RouterTestingModule } from '@angular/router/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

describe('ItemDialogComponent', () => {
  let component: ItemDialogComponent;
  let fixture: ComponentFixture<ItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemDialogComponent ],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        MatToolbarModule,
        MatButtonModule,
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default count to 1 when not specified', () => {
    component.data.name = 'Test Item';
    component.onAddClick();
    expect(component.lastAddedItem.count).toBe(1);
  });

  it('should enable Add button only when name is filled', () => {
    const addButton = fixture.debugElement.query(By.css('button:contains("Add")'));
    expect(addButton.nativeElement.disabled).toBeTruthy();

    component.data.name = 'Test';
    fixture.detectChanges();

    expect(addButton.nativeElement.disabled).toBeFalsy();
  });
});