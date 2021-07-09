import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarksLayoutComponent } from './bookmarks-layout.component';

describe('BookmarksLayoutComponent', () => {
  let component: BookmarksLayoutComponent;
  let fixture: ComponentFixture<BookmarksLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookmarksLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarksLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
