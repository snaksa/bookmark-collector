import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationWrapperSideComponent } from './authentication-wrapper-side.component';

describe('AuthenticationWrapperSideComponent', () => {
  let component: AuthenticationWrapperSideComponent;
  let fixture: ComponentFixture<AuthenticationWrapperSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthenticationWrapperSideComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationWrapperSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
