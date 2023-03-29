import { ContainerCardPageComponent } from './container-card-page.component';
import { ContainerComponent } from '../container/container.component';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialog } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';

describe('ContainerCardPageComponent', () => {
  let component: ContainerCardPageComponent;
  let fixture: ComponentFixture<ContainerCardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerCardPageComponent, ContainerComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatGridListModule
       ],
      providers: [
        { provide: MatDialog, useValue: {} },
        ContainerCardPageComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerCardPageComponent);
    component = fixture.componentInstance;
    
    component.containerName = 'Test Container';
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct navigation', () => {
    expect(fixture.nativeElement.querySelector('.logo').textContent).toContain('TRACKIT');
    expect(fixture.nativeElement.querySelector('.inventoryButton').textContent).toContain('My Inventory');
  });

  it('should display the correct page title', () => {
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain(component.containerName);
  });

  it('should call openDialog on click of add container button', () => {
    fixture.detectChanges();
    spyOn(component, 'openDialog');
    const newContainerButton = fixture.debugElement.query(By.css('.newContainerButton')).nativeElement;
    newContainerButton.click();
    expect(component.openDialog).toHaveBeenCalled();
  });

  it('should call openItemDialog on click of add item button', () => {
    fixture.detectChanges();
    spyOn(component, 'openItemDialog');
    const newItemButton = fixture.debugElement.query(By.css('.newItemButton')).nativeElement;
    newItemButton.click();
    expect(component.openItemDialog).toHaveBeenCalled();
  });

  it('should call backClicked on click of back button', () => {
    fixture.detectChanges();
    spyOn(component, 'backClicked');
    const backButtonClick = fixture.debugElement.query(By.css('.backButton')).nativeElement;
    backButtonClick.click();
    expect(component.backClicked).toHaveBeenCalled();
  });
});
