import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveMenuComponent } from './move-menu.component';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { By } from '@angular/platform-browser';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTreeModule } from '@angular/material/tree';

describe('MoveMenuComponent', () => {
  let component: MoveMenuComponent;
  let fixture: ComponentFixture<MoveMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [MoveMenuComponent],
    imports: [MatButtonToggleModule,
        MatTreeModule],
    providers: [
        HttpClient,
        HttpClientModule,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();

    fixture = TestBed.createComponent(MoveMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain button toggles', () => {
    const buttonToggleGroup = fixture.debugElement.query(By.css('mat-button-toggle-group'));
    expect(buttonToggleGroup).toBeTruthy();
  });
});
