import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-dialog-action',
  templateUrl: './dialog-action.component.html',
  styleUrls: ['./dialog-action.component.scss'],
})
export class DialogActionComponent {
  @Input() color: ThemePalette = undefined;
  @Output() onClick: EventEmitter<boolean> = new EventEmitter<boolean>();
}
