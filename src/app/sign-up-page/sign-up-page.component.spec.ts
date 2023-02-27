import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SignUpPageComponent } from './sign-up-page.component';
import { AuthService } from '../auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SignUpPageComponent', () => {
  let component: SignUpPageComponent;
  let fixture: ComponentFixture<SignUpPageComponent>;
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpPageComponent],
      imports: [
        RouterTestingModule,
        FormsModule,
        HttpClientTestingModule,
        MatToolbarModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
      ],
      providers: [AuthService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpPageComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onSubmit() should call authService.signup() and navigate to inventory page on successful sign-up', () => {
    const navigateSpy = spyOn(component['router'], 'navigate');
    const authSpy = spyOn(authService, 'loginSuccess');
    const authServiceSignupSpy = spyOn(authService, 'signup').and.returnValue(
      of(true)
    );

    component.username = 'testuser';
    component.password = 'testpassword';
    component.password_confirmation = 'testpassword';

    component.onSubmit();

    expect(authServiceSignupSpy).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'testpassword',
      password_confirmation: 'testpassword',
    });
    expect(authSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/inventory']);
  });

  it('onSubmit() should not navigate to inventory page if passwords do not match', () => {
    const navigateSpy = spyOn(component['router'], 'navigate');
    const authSpy = spyOn(authService, 'loginSuccess');

    component.username = 'testuser';
    component.password = 'testpassword';
    component.password_confirmation = 'mismatchedpassword';

    component.onSubmit();

    expect(authSpy).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('constructor should navigate to inventory page if user is already authenticated', () => {
    const authSpy = spyOn(authService, 'isAuthenticated').and.returnValue(true);
    const navigateSpy = spyOn(component['router'], 'navigate');

    fixture = TestBed.createComponent(SignUpPageComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();

    expect(authSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/inventory']);
  });
});
