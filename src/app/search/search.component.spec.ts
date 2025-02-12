import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';

import { RouterTestingModule } from "@angular/router/testing";
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [SearchComponent, SidebarNavComponent],
    imports: [RouterTestingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatIconModule,
        FormsModule,
        MatInputModule,
        MatGridListModule,
        MatSidenavModule,
        MatTreeModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct navigation', () => {
    expect(fixture.nativeElement.querySelector('.logo').textContent).toContain('TRACKIT');
    expect(fixture.nativeElement.querySelector('.signUpButton').textContent).toContain('My Inventory');
  });

  it('should display the correct page title', () => {
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Search Results');
  });

  it('should call backButton on click of back button', () => {
    fixture.detectChanges();
    spyOn(component, 'backClicked');
    const backButtonClick = fixture.debugElement.query(By.css('.backButton')).nativeElement;
    backButtonClick.click();
    expect(component.backClicked).toHaveBeenCalled();
  });
});
