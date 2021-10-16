import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLabelDialogComponent } from './tags-dialog.component';

describe('TagsDialogComponent', () => {
  let component: EditLabelDialogComponent;
  let fixture: ComponentFixture<EditLabelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLabelDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLabelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
