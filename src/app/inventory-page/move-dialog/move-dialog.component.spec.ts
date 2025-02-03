import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoveMenuComponent } from '../move-menu/move-menu.component';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
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
    declarations: [MoveDialogComponent, MoveMenuComponent],
    imports: [MatDialogModule,
        BrowserAnimationsModule,
        MatButtonToggleModule,
        MatTreeModule],
    providers: [
        HttpClient,
        HttpClientModule,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
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

  it('should call move() when move is clicked', () => {
    spyOn(component, 'move');
    const moveButton = fixture.nativeElement.querySelector('.renameButton');
    moveButton.click();
    expect(component.move).toHaveBeenCalled();
  });

  it('should call cancel() when cancel is clicked', () => {
    spyOn(component, 'cancel');
    const cancelButton = fixture.nativeElement.querySelector('.cancelButton');
    cancelButton.click();
    expect(component.cancel).toHaveBeenCalled();
  });
});
