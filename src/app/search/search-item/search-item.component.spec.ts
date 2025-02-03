import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchItemComponent } from './search-item.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { By } from '@angular/platform-browser';

import { MatCardModule } from '@angular/material/card';

describe('SearchItemComponent', () => {
  let component: SearchItemComponent;
  let fixture: ComponentFixture<SearchItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [SearchItemComponent],
    imports: [MatCardModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    fixture = TestBed.createComponent(SearchItemComponent);
    component = fixture.componentInstance;

    const itemName = 'Test Item';
    const itemID = -1;
    const userName = '';
    const locationID = -1;
    const count = -1;
    
    component.item = {
      ItemID: itemID,
      User: userName,
      ItemName: itemName,
      LocID: locationID,
      Count: count
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
    expect(nameElement.textContent).toContain('Test Item');
    const locationElement = fixture.debugElement.query(By.css('.locationName')).nativeElement;
    expect(locationElement.textContent).toContain('Location: ');
  });
});
