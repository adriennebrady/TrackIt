import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedItemComponent } from './deleted-item.component';

describe('DeletedItemComponent', () => {
  let component: DeletedItemComponent;
  let fixture: ComponentFixture<DeletedItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletedItemComponent ]
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
