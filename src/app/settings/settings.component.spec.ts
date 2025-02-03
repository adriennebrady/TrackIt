import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';

import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatTreeModule } from '@angular/material/tree';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [SettingsComponent, SidebarNavComponent],
    imports: [MatDialogModule,
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatTreeModule,
        RouterTestingModule],
    providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
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

  it('should call logOut() when sign out button is clicked', () => {
    const logOutButton = fixture.debugElement.query(By.css('.logOutBUtton'));
    spyOn(component, 'logOut');
    logOutButton.nativeElement.click();
    expect(component.logOut).toHaveBeenCalled();
  });

  it('should call openConfirmDialog() when the delete account button is clicked', () => {
    spyOn(component, 'openConfirmDialog');
    const deleteAccountButton = fixture.debugElement.query(By.css('.deleteButton'));
    deleteAccountButton.nativeElement.click();
    expect(component.openConfirmDialog).toHaveBeenCalled();
  });
});
