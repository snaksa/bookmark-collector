import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-authentication-redirect-button',
  templateUrl: './authentication-redirect-button.component.html',
  styleUrls: ['./authentication-redirect-button.component.scss'],
})
export class AuthenticationRedirectButtonComponent {
  @Output() click: EventEmitter<any> = new EventEmitter<any>();

  handleClick() {
    this.click.next();
  }
}
