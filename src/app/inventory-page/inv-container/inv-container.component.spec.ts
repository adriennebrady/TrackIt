import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvContainerComponent } from './inv-container.component';
import { InventoryPageComponent } from '../../inventory-page/inventory-page.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('InvContainerComponent', () => {
  let component: InvContainerComponent;
  let fixture: ComponentFixture<InvContainerComponent>;
  let inventoryPage: InventoryPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InvContainerComponent,
        MatDialogModule
      ],
      providers: [
        InventoryPageComponent,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
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
