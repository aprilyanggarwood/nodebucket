/*
 Title: login.component.ts
 Author: Professor Krasso
 Date: 01/12/2023
 Modified By: April Yang
 Description: Login page component
 */


import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { EmployeeService } from 'src/app/shared/services/employee.service';
import { Message } from 'primeng/api';
import { Employee } from 'src/app/shared/models/employee.interface';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorMessages: Message[] = [];
  employee: Employee;

  loginForm: FormGroup = this.fb.group({
    empId: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]*$')])]
  })


  constructor(private fb: FormBuilder, private router: Router, private cookieService: CookieService,
    private http: HttpClient, private employeeService: EmployeeService) {

    this.employee = {} as Employee; // fixed the employee type error
      }

  ngOnInit(): void {
  }


  login() {
    const empId = this.loginForm.controls['empId'].value;

    this.employeeService.findEmployeeById(empId).subscribe({
      next: (res) => {
        if (res) {
          this.employee = res;
          this.cookieService.set('session_user', this.employee.empId.toString(), 1);
          this.cookieService.set('session_name', `${this.employee.firstName} ${this.employee.lastName}`, 1);
          this.router.navigate(['/'])
        } else {
          this.errorMessages = [
            {severity:'error', summary:'Error', detail:'Please enter a valid employeeId to continue.'}
          ]
        }
      },
      error: (e) => {
        console.log(e);
        this.errorMessages = [
          { severity:'error', summary: 'Error', detail: e.message}
        ]
      }


    })

  }

}
