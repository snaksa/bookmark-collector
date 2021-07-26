import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationRedirectButtonComponent } from './authentication-redirect-button.component';

describe('AuthenticationRedirectButtonComponent', () => {
  let component: AuthenticationRedirectButtonComponent;
  let fixture: ComponentFixture<AuthenticationRedirectButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthenticationRedirectButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationRedirectButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
