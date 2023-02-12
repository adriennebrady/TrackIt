import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerCardPageComponent } from './container-card-page.component';

describe('ContainerCardPageComponent', () => {
  let component: ContainerCardPageComponent;
  let fixture: ComponentFixture<ContainerCardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerCardPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
