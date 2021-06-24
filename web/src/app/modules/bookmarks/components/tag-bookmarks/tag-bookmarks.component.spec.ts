import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagBookmarksComponent } from './tag-bookmarks.component';

describe('TagBookmarksComponent', () => {
  let component: TagBookmarksComponent;
  let fixture: ComponentFixture<TagBookmarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagBookmarksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagBookmarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
