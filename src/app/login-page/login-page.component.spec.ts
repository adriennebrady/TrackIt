import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginPageComponent } from './login-page.component';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { InventoryPageComponent } from '../inventory-page/inventory-page.component';
import { ContainerCardPageComponent } from '../container-card-page/container-card-page.component';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'login',
      'loginSuccess',
    ]);

    authServiceSpy.redirectUrl = '/inventory';

    TestBed.configureTestingModule({
      declarations: [LoginPageComponent],
      imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatToolbarModule,
        RouterTestingModule.withRoutes([
          { path: 'inventory', component: InventoryPageComponent },
          { path: 'containers/:id', component: ContainerCardPageComponent },
        ]),
        MatCardModule,
        RouterModule,
      ],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should call authService.login with the correct user', () => {
      const username = 'testuser';
      const password = 'testpassword';
      component.username = username;
      component.password = password;
      const expectedUser = { username, password };
      authServiceSpy.login.and.returnValue(of(true));
      component.onSubmit();
      expect(authServiceSpy.login).toHaveBeenCalledWith(expectedUser);
    });

    it('should call authService.loginSuccess on successful login', () => {
      authServiceSpy.login.and.returnValue(of(true));
      component.onSubmit();
      expect(authServiceSpy.loginSuccess).toHaveBeenCalled();
    });

    it('should navigate to the redirect URL on successful login and a redirect URL is set', () => {
      const redirectUrl = '/containers/1';
      authServiceSpy.redirectUrl = redirectUrl;
      authServiceSpy.login.and.returnValue(of(true));
      const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
      component.onSubmit();
      expect(routerSpy).toHaveBeenCalledWith([redirectUrl]);
    });

    it('should navigate to /inventory on successful login and no redirect URL is set', () => {
      authServiceSpy.login.and.returnValue(of(true));
      const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
      component.onSubmit();
      expect(routerSpy).toHaveBeenCalledWith(['/inventory']);
    });
  });
});
