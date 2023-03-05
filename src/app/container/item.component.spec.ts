import { ItemComponent } from './item.component';
import { ContainerCardPageComponent } from '../container-card-page/container-card-page.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { RouterTestingModule } from '@angular/router/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

describe('ItemComponent', () => {
  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;
  let containerCardPage: ContainerCardPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemComponent, ContainerCardPageComponent ],
      imports: [
        RouterTestingModule,
        MatToolbarModule,
        MatButtonModule,
        HttpClientTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatMenuModule
       ],
      providers: [
        { provide: MatDialog, useValue: {} },
        ItemComponent, ContainerCardPageComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemComponent);
    component = fixture.componentInstance;
    containerCardPage = TestBed.inject(ContainerCardPageComponent);
    const itemName = 'Test Item';
    const itemLocation = 'This is a test item';
    component.item = {
      Name: itemName,
      Location: itemLocation
    };
    component.index = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the item name and location', () => {
    fixture.detectChanges();
    const nameElement = fixture.debugElement.query(By.css('.containerName')).nativeElement;
    const descriptionElement = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(nameElement.textContent).toContain('Test Item');
    expect(descriptionElement.textContent).toContain('This is a test item');
  });
});
