import { ContainerCardPageComponent } from './container-card-page.component';
import { ContainerComponent } from '../container/container.component';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialog } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';

describe('ContainerCardPageComponent', () => {
  let component: ContainerCardPageComponent;
  let fixture: ComponentFixture<ContainerCardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerCardPageComponent, ContainerComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatGridListModule
       ],
      providers: [
        { provide: MatDialog, useValue: {} },
        ContainerCardPageComponent
      ]
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
