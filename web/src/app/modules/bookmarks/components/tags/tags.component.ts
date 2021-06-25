import { Component, OnInit } from '@angular/core';
import { Label } from 'src/app/modules/shared/models/label.model';
import { LabelsService } from '../../services/labels.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements OnInit {
  labels: Label[] = [];

  constructor(private labelsService: LabelsService) {}

  ngOnInit(): void {
    this.labelsService.getLabels().subscribe((data) => {
      this.labels = data;
    });
  }
}
