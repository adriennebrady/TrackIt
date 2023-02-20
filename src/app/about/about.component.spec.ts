import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AboutComponent } from './about.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutComponent],
      imports: [RouterTestingModule, MatToolbarModule, MatButtonModule],
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

  it('should have a toolbar with a logo and navigation buttons', () => {
    const toolbarElement = fixture.nativeElement.querySelector('.navbar');
    expect(toolbarElement).toBeTruthy();

    const logoElement = fixture.nativeElement.querySelector('.logo');
    expect(logoElement).toBeTruthy();
    expect(logoElement.textContent).toContain('TRACKIT');

    const aboutButtonElement = fixture.nativeElement.querySelector(
      'button[routerlink="/about"]'
    );
    expect(aboutButtonElement).toBeTruthy();
    expect(aboutButtonElement.textContent).toContain('About');

    const loginButtonElement = fixture.nativeElement.querySelector(
      'button[routerlink="/login"]'
    );
    expect(loginButtonElement).toBeTruthy();
    expect(loginButtonElement.textContent).toContain('Login');

    const signUpButtonElement =
      fixture.nativeElement.querySelector('.signUpButton');
    expect(signUpButtonElement).toBeTruthy();
    expect(signUpButtonElement.textContent).toContain('Sign Up');
  });

  it('should have a title and description', () => {
    const titleElement = fixture.nativeElement.querySelector('.title');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent.trim()).toEqual(
      'Find it fast, TrackIt first.'
    );

    const descriptionElement =
      fixture.nativeElement.querySelector('.description');
    expect(descriptionElement).toBeTruthy();
  });
});
