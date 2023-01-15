/*
Title: base-layout.component.ts
Author: Professor Krasso
Date: 01/03/2023
Modified By: April Yang
Description: application layout component
*/


import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css']
})
export class BaseLayoutComponent implements OnInit {

  year: number = Date.now();

  constructor(private cookieService: CookieService, private router: Router) { }

  ngOnInit(): void {
  }

  // logout function deletes all cookies and navigate user to login page
  logout() {
    this.cookieService.deleteAll();
    this.router.navigate(['/session/login']);
  }


}
