import { ItemComponent } from './item.component';
import { ContainerCardPageComponent } from '../container-card-page/container-card-page.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
