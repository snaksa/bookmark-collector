import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationFormComponent } from './form.component';

describe('FormComponent', () => {
  let component: AuthenticationFormComponent;
  let fixture: ComponentFixture<AuthenticationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthenticationFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
