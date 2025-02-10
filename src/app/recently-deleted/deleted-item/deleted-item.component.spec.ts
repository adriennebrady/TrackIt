import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedItemComponent } from './deleted-item.component';
import { RecentlyDeletedComponent } from '../../recently-deleted/recently-deleted.component';
import { ItemComponent } from '../../container-card-page/item/item.component';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { By } from '@angular/platform-browser';

import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

describe('DeletedItemComponent', () => {
  let component: DeletedItemComponent;
  let fixture: ComponentFixture<DeletedItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [DeletedItemComponent, RecentlyDeletedComponent, ItemComponent],
    imports: [MatCardModule,
        MatIconModule],
    providers: [
        HttpClient,
        HttpClientModule,
        { provide: MatDialog, useValue: {} },
        RecentlyDeletedComponent,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();

    fixture = TestBed.createComponent(DeletedItemComponent);
    component = fixture.componentInstance;
    component.item.DeletedItemName = 'Test Item';
    component.item.DeletedItemCount = 5;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the item name correctly', () => {
    const itemName = fixture.debugElement.query(By.css('.containerName')).nativeElement;
    expect(itemName.textContent).toContain(component.item.DeletedItemName);
  });

  it('should display the item count correctly', () => {
    const itemCount = fixture.debugElement.query(By.css('.countAmount')).nativeElement;
    expect(itemCount.textContent).toContain(`Count: ${component.item.DeletedItemCount}`);
  });


  it('should call deleteItem() on click of permanently delete item button', () => {
    fixture.detectChanges();
    spyOn(component, 'deleteItem');
    const newContainerButton = fixture.debugElement.query(By.css('.deleteButton')).nativeElement;
    newContainerButton.click();
    expect(component.deleteItem).toHaveBeenCalled();
  });
    
  it('should call restoreItem() on click of restore button', () => {
    fixture.detectChanges();
    spyOn(component, 'restoreItem');
    const restoreButton = fixture.debugElement.query(By.css('.restoreButton')).nativeElement;
    restoreButton.click();
    expect(component.restoreItem).toHaveBeenCalled();
  });
});
