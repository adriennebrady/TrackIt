import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedItemComponent } from './deleted-item.component';
import { RecentlyDeletedComponent } from '../../recently-deleted/recently-deleted.component';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

describe('DeletedItemComponent', () => {
  let component: DeletedItemComponent;
  let fixture: ComponentFixture<DeletedItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletedItemComponent, RecentlyDeletedComponent ],
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule
      ],
      providers: [
        HttpClient,
        HttpClientModule,
        { provide: MatDialog, useValue: {} },
        RecentlyDeletedComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
