import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlyDeletedComponent } from './recently-deleted.component';
import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialog } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTreeModule } from '@angular/material/tree';

describe('RecentlyDeletedComponent', () => {
  let component: RecentlyDeletedComponent;
  let fixture: ComponentFixture<RecentlyDeletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentlyDeletedComponent, SidebarNavComponent ],
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        BrowserAnimationsModule,
        MatGridListModule,
        MatTreeModule,
        RouterTestingModule
      ],
      providers: [
        HttpClient,
        HttpClientModule,
        SidebarNavComponent,
        { provide: MatDialog, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentlyDeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct navigation', () => {
    const logoElement = fixture.nativeElement.querySelector('.logo');
    expect(logoElement.textContent).toContain('TRACKIT');

    const signOutButton = fixture.nativeElement.querySelector('.signUpButton');
    expect(signOutButton.textContent).toContain('My Inventory');
  });

  it('should display correct heading', () => {
    const headingElement = fixture.nativeElement.querySelector('.inventoryHeading h1');
    expect(headingElement.textContent).toContain('Recently Deleted');
  });

  it('should display message when there are no items', () => {
    component.items = [];
    fixture.detectChanges();
    const noItemsElement = fixture.nativeElement.querySelector('.noItems');
    expect(noItemsElement.textContent).toContain('No recently deleted items.');
  });
});
