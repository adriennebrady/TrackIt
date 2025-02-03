import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarNavComponent } from './sidebar-nav.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatTreeModule } from '@angular/material/tree';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('SidebarNavComponent', () => {
  let component: SidebarNavComponent;
  let fixture: ComponentFixture<SidebarNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [SidebarNavComponent],
    imports: [MatTreeModule],
    providers: [
        HttpClient,
        HttpClientModule,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();

    fixture = TestBed.createComponent(SidebarNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
