import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetComponent } from './login.component';

describe('LoginComponent', () => {
  let component: ResetComponent;
  let fixture: ComponentFixture<ResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
