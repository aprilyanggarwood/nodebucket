/*
 Title: contact.component.ts
 Author: Professor Krasso
 Date: 01/19/2023
 Modified By: April Yang
 Description: Contact page component
 */


import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
    // set variable contactUs to type string
    contactUs: string;

  constructor() {
    // Define contactUs to string Contact Us,
    this.contactUs = "Contact Us"
   }

  ngOnInit(): void {
  }

}
