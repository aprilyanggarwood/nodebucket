/*
Title: base-layout.component.ts
Author: Professor Krasso
Date: 01/03/2023
Modified By: April Yang
Description: application layout component
*/


import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css']
})
export class BaseLayoutComponent implements OnInit {

  year: number = Date.now();

  constructor() { }

  ngOnInit(): void {
  }
}
