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

  // initial the array of error messages to empty
  errorMessages: Message[] = [];
  // assigns the employee variable to Employee schema
  employee: Employee;

  // Set up validations for login form, including employee id is required, and only numerical values are valid.
  loginForm: FormGroup = this.fb.group({
    empId: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])]
  })


  constructor(private fb: FormBuilder, private router: Router, private cookieService: CookieService,
    private http: HttpClient, private employeeService: EmployeeService) {

    this.employee = {} as Employee; // fixed the employee type error
      }

  ngOnInit(): void {
  }


  // login function for finding an employee by id from mongoDB
  login() {
    const empId = this.loginForm.controls['empId'].value;
    // use session service to call http request
    // use cookie service to remember user id and name
    this.employeeService.findEmployeeById(empId).subscribe({
      next: (res) => {
        if (res.data) {
          console.log('this is the response from the findEmployeeById API');
          console.log(res.data);

          this.employee = res.data;
          this.cookieService.set('session_user', this.employee.empId.toString(), 1); // convert employee id to string
          this.cookieService.set('session_name', `${this.employee.firstName} ${this.employee.lastName}`, 1);
          this.router.navigate(['/']) // navigate user to home page when user successful log in
        } else {
          // Error messages handled by PrimNG
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
