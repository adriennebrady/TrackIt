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
});
