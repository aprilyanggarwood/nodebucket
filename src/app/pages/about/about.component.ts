/*
 Title: about.component.ts
 Author: Professor Krasso
 Updated Date: 01/26/2023
 Modified By: April Yang
 Description: About page component
 */


import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  aboutUs: string;

  constructor() {

    this.aboutUs = "About Us"
  }

  ngOnInit(): void {
  }

}
