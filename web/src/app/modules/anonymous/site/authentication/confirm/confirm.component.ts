import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  confirmed = false;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router, private titleService: Title) {
    this.titleService.setTitle('Confirm | Sinilinx');
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.authService.confirmUser(params.username, params.code).subscribe(() => {
        this.confirmed = true;
      });
    });
  }
}
