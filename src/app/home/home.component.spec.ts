import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HomeComponent } from './home.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugElement: DebugElement;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatToolbarModule, MatButtonModule],
      declarations: [HomeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should display the TRACKIT logo', () => {
    const logo = element.querySelector('.logo');
    expect(logo?.textContent).toContain('TRACKIT');
  });

  it('should have a button for About', () => {
    const button = debugElement.query(By.css('button[routerLink="/about"]'));
    expect(button).toBeTruthy();
  });

  it('should have a button for Login', () => {
    const button = debugElement.query(By.css('button[routerLink="/login"]'));
    expect(button).toBeTruthy();
  });

  it('should have a button for Sign Up', () => {
    const button = debugElement.query(By.css('button[routerLink="/signup"]'));
    expect(button).toBeTruthy();
    expect(button.nativeElement.classList).toContain('signUpButton');
  });

  it('should display the home page title', () => {
    const title = element.querySelector('.homeTitle');
    expect(title?.textContent).toContain('Find your charger in seconds.');
  });

  it('should display the home page description', () => {
    const description = element.querySelector('.description');
    expect(description?.textContent).toContain(
      'Stay organized and in control with our personal inventory tracker.'
    );
  });

  it('should have a button to get started', () => {
    const button = fixture.debugElement.query(By.css('.centerButton'));
    expect(button).toBeTruthy();
  });
});
