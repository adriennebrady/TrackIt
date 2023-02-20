import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContainerComponent } from './container.component';
import { InventoryPageComponent } from '../inventory-page/inventory-page.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import { ContainerCardPageComponent } from '../container-card-page/container-card-page.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

describe('ContainerComponent', () => {
  let component: ContainerComponent;
  let fixture: ComponentFixture<ContainerComponent>;
  let inventoryPage: InventoryPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContainerComponent],
      imports: [
        MatDialogModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatMenuModule,
        MatDividerModule,
      ],
      providers: [ContainerCardPageComponent, InventoryPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerComponent);
    component = fixture.componentInstance;
    inventoryPage = TestBed.inject(InventoryPageComponent);
    const containerName = 'Test Container';
    const containerDescription = 'This is a test container';
    component.container = {
      name: containerName,
      description: containerDescription,
    };
    component.index = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the container name and description', () => {
    fixture.detectChanges();
    const nameElement = fixture.debugElement.query(
      By.css('.containerName')
    ).nativeElement;
    const descriptionElement = fixture.debugElement.query(
      By.css('p')
    ).nativeElement;

    expect(nameElement.textContent).toContain('Test Container');
    expect(descriptionElement.textContent).toContain(
      'This is a test container'
    );
  });

  it('should call openConfirmDialog on click of delete button', () => {
    const openConfirmDialogSpy = spyOn(inventoryPage, 'openConfirmDialog');
    const deleteButton = fixture.debugElement.query(
      By.css('.deleteButton')
    ).nativeElement;
    deleteButton.click();
    expect(openConfirmDialogSpy).toHaveBeenCalledWith(1);
  });
});
