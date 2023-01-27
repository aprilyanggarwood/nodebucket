/*
Title: confirm-dialog.component.ts
Author: Professor Krasso
Date: 01/26/2023
Modified By: April Yang
Description: confirm-dialog component
*/


import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../models/dialog-data.interface';


@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
 // assign variable dialogData to model DialogData interface
  dialogData: DialogData;

  // Inject MAT_DIALOG_DATA from Angular material, and use DialogData interface
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.dialogData = data;
    console.log(this.dialogData);
  }

  ngOnInit(): void {
  }

}
