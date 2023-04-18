import { InventoryPageComponent } from './inventory-page.component';
import { ContainerComponent } from '../container/container.component';
import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';

describe('InventoryPageComponent', () => {
  let component: InventoryPageComponent;
  let fixture: ComponentFixture<InventoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryPageComponent, ContainerComponent, SidebarNavComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        HttpClientModule,
        MatToolbarModule,
        MatButtonModule,
        MatInputModule,
        MatGridListModule,
        MatCardModule,
        MatIconModule,
        MatMenuModule,
        MatDividerModule,
        FormsModule,
        BrowserAnimationsModule,
        MatSidenavModule,
        MatTreeModule
      ],
      providers: [
        { provide: MatDialog, useValue: {} },
        InventoryPageComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(InventoryPageComponent).toBeTruthy();
  });

  it('should display the correct navigation', () => {
    expect(fixture.nativeElement.querySelector('.logo').textContent).toContain('TRACKIT');
    expect(fixture.nativeElement.querySelector('.signUpButton').textContent).toContain('My Inventory');
  });

  it('should display the correct page title and description', () => {
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Your Inventory');
    expect(fixture.nativeElement.querySelector('p').textContent).toContain('Click a container to view items or create a new container.');
  });

  it('should call openDialog on click of new container button', () => {
    fixture.detectChanges();
    spyOn(component, 'openDialog');
    const newContainerButton = fixture.debugElement.query(By.css('.newContainerButton')).nativeElement;
    newContainerButton.click();
    expect(component.openDialog).toHaveBeenCalled();
  });

  // should allow user to create new container
  // should display containers
});
