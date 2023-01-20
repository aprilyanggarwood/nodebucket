/*
 Title: home.component.ts
 Author: Professor Krasso
 Updated Date: 01/19/2023
 Modified By: April Yang
 Description: Home page component
 */


// import
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Employee } from 'src/app/shared/models/employee.interface';
import { Item } from 'src/app/shared/models/item.interface';
import { TaskService } from 'src/app/shared/services/task.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // assigns the employee variable to Employee schema
  employee: Employee;
  // initial variable todo to an empty array of item
  todo: Item[];
  // initial variable done to an empty array of item
  done: Item[];
   // set empId to type of number
  empId: number;

  // use form builder to build from group
  // set up validations for tasks input
  taskForm: FormGroup = this.fb.group({
    task:[null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(35)])]
  })

  constructor(private taskService: TaskService, private cookieService: CookieService, private fb: FormBuilder) {

    // fixed the employee, todo, done, and empId type errors
    this.employee = {} as Employee;
    this.todo = [];
    this.done = [];
    this.empId = parseInt(this.cookieService.get('session_user'), 10); // from auth.guard.ts

    // use taskService to subscribe the findAllTasks value by empId
    this.taskService.findAllTasks(this.empId).subscribe({
      next: (res) => {
        this.employee = res;
        console.log('Response from the findAllTasks service call');
        console.log(this.employee);
      },
      error: (e) => {
        console.log(e.message);
      },
      // find all tasks include to do and done lists by empId
      complete: () => {
        this.todo = this.employee.todo;
        this.done = this.employee.done;

        console.log('--onComplete() method from the home.component.ts.file, findAllTasks() service call.--');
        console.log(this.todo);
        console.log(this.done);
      }
    })
   }

  ngOnInit(): void {
  }

  // create a new task
  createTask() {
    const newTask = this.taskForm.controls['task'].value;
     // use task service to subscribe the new task value by empId
    this.taskService.createTask(this.empId, newTask).subscribe({
      next: (res) => {

        this.employee = res;
        console.log('--This is the response from the createTask service call.')
        console.log(res);
      },
      error: (e) => {
        console.log(e.message);
      },
      //create a new task to to do list by empId
      complete: () => {
        this.todo = this.employee.todo;
        this.done = this.employee.done; // ?

        console.log('--onComplete method from the home.component.ts file, createTask() service call--');
        console.log(this.todo);
        console.log(this.done);

        this.taskForm.controls['task'].setErrors({ 'incorrect': false }); // ?

      }
    })


 }


}
