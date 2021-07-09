import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Bookmark } from 'src/app/modules/shared/models/bookmark.model';
import { LabelsService } from '../../../labels/services/labels.service';

@Component({
  selector: 'app-tag-bookmarks',
  templateUrl: './tag-bookmarks.component.html',
  styleUrls: ['./tag-bookmarks.component.scss'],
})
export class TagBookmarksComponent implements OnInit {
  bookmarks: Bookmark[] = [];

  constructor(private route: ActivatedRoute, private labelsService: LabelsService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.labelsService.getLabelBookmarks(params.id).subscribe((data) => {
        this.bookmarks = data;
      });
    });
  }

  toggleFavoriteBookmark(bookmark: Bookmark) {
    this.bookmarks.forEach((item, index) => {
      if (item.id === bookmark.id) {
        this.bookmarks[index].isFavorite = bookmark.isFavorite;
      }
    });
  }

  toggleArchiveBookmark(bookmark: Bookmark) {
    this.bookmarks.forEach((item, index) => {
      if (item.id === bookmark.id) {
        this.bookmarks[index].isArchived = bookmark.isArchived;
      }
    });
  }

  deleteBookmark(bookmark: Bookmark) {
    this.bookmarks = this.bookmarks.filter((item) => item.id !== bookmark.id);
  }
}
