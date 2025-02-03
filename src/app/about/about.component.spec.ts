import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AboutComponent } from './about.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatIconModule } from '@angular/material/icon';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [AboutComponent],
    imports: [RouterTestingModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule],
    providers: [AuthService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct content when user is logged in', () => {
    spyOn(component, 'loggedIn').and.returnValue(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.logo').textContent).toContain(
      'TRACKIT'
    );
    expect(fixture.nativeElement.querySelectorAll('button').length).toBe(5);
    expect(
      fixture.nativeElement.querySelector('.signUpButton').textContent
    ).toContain('My Inventory');
  });

  it('should display the correct content when user is logged out', () => {
    spyOn(component, 'loggedIn').and.returnValue(false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.logo').textContent).toContain(
      'TRACKIT'
    );
    expect(fixture.nativeElement.querySelectorAll('button').length).toBe(3);
    expect(
      fixture.nativeElement.querySelector('.signUpButton').textContent
    ).toContain('Sign Up');
  });
});
