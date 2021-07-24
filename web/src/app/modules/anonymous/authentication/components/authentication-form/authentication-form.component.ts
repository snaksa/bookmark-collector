import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-authentication-form',
  templateUrl: './authentication-form.component.html',
  styleUrls: ['./authentication-form.component.scss'],
})
export class AuthenticationFormComponent {
  @Input() title: string = '';
  @Input() formGroup: FormGroup = new FormGroup({});
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();

  submit() {
    this.onSubmit.next();
  }
}
