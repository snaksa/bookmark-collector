import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Bookmark } from 'src/app/modules/shared/models/bookmark.model';
import { LabelsService } from '../../../labels/services/labels.service';
import { Label } from '../../../../shared/models/label.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tag-bookmarks',
  templateUrl: './tag-bookmarks.component.html',
})
export class TagBookmarksComponent implements OnInit {
  isLoading: boolean = true;
  label: Label = {
    id: '',
    title: '',
    bookmarks: [],
    color: '',
  };

  constructor(private route: ActivatedRoute, private labelsService: LabelsService, private titleService: Title) {
    this.titleService.setTitle(`# | Sinilinx`);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.isLoading = true;
      this.label = {
        id: '',
        title: '',
        bookmarks: [],
        color: '',
      };

      this.labelsService.getLabelBookmarks(params.id).subscribe((data) => {
        this.label = data;
        this.isLoading = false;

        this.titleService.setTitle(`# ${this.label.title} | Sinilinx`);
      });
    });
  }

  toggleFavoriteBookmark(bookmark: Bookmark) {
    this.label.bookmarks.forEach((item, index) => {
      if (item.id === bookmark.id) {
        this.label.bookmarks[index].isFavorite = bookmark.isFavorite;
      }
    });
  }

  toggleArchiveBookmark(bookmark: Bookmark) {
    this.label.bookmarks.forEach((item, index) => {
      if (item.id === bookmark.id) {
        this.label.bookmarks[index].isArchived = bookmark.isArchived;
      }
    });
  }

  deleteBookmark(bookmark: Bookmark) {
    this.label.bookmarks = this.label.bookmarks.filter((item) => item.id !== bookmark.id);
  }
}
