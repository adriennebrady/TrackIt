import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoveMenuComponent } from '../move-menu/move-menu.component';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MoveDialogComponent } from './move-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTreeModule } from '@angular/material/tree';

describe('MoveDialogComponent', () => {
  let component: MoveDialogComponent;
  let fixture: ComponentFixture<MoveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveDialogComponent, MoveMenuComponent ],
      imports: [
        MatDialogModule,
        HttpClientTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatButtonToggleModule,
        MatTreeModule
      ],
      providers: [
        HttpClient,
        HttpClientModule,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
