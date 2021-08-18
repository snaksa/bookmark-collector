import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-anonymous-layout',
  templateUrl: './anonymous-layout.component.html',
  styleUrls: ['./anonymous-layout.component.scss']
})
export class AnonymousLayoutComponent {

  constructor(private router: Router) { }

  redirectToRegister() {
    this.router.navigateByUrl('register');
  }

  redirectToLogin() {
    this.router.navigateByUrl('login');
  }
}
