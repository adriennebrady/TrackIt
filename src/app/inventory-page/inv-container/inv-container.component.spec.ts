import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvContainerComponent } from './inv-container.component';
import { InventoryPageComponent } from '../../inventory-page/inventory-page.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { By } from '@angular/platform-browser';

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
    imports: [MatDialogModule,
        MatCardModule,
        MatIconModule,
        MatMenuModule,
        MatDividerModule],
    providers: [
        InventoryPageComponent,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
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

  it('should call seeInside on click of see inside button', () => {
    fixture.detectChanges();
    spyOn(component, 'seeInside');
    const seeInsideButton = fixture.debugElement.query(By.css('.seeInsideButton')).nativeElement;
    seeInsideButton.click();
    expect(component.seeInside).toHaveBeenCalled();
  });

  it('should call deleteContainer on click of delete button', () => {
    fixture.detectChanges();
    spyOn(component, 'deleteContainer');
    const newContainerButton = fixture.debugElement.query(By.css('.deleteButton')).nativeElement;
    newContainerButton.click();
    expect(component.deleteContainer).toHaveBeenCalled();
  });
});
