import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvContainerComponent } from './inv-container.component';
import { InventoryPageComponent } from '../../inventory-page/inventory-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

describe('InvContainerComponent', () => {
  let component: InvContainerComponent;
  let fixture: ComponentFixture<InvContainerComponent>;
  let inventoryPage: InventoryPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InvContainerComponent        
      ],
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        MatDialogModule,
        MatCardModule,
        MatIconModule,
        MatMenuModule,
        MatDividerModule
      ],
      providers: [
        InventoryPageComponent
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

  it('should display see inside button', () => {
    expect(fixture.nativeElement.querySelector('.seeInsideButton').textContent).toContain('See Inside >');
  });
});
