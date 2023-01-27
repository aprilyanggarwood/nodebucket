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
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { Employee } from 'src/app/shared/models/employee.interface';
import { Item } from 'src/app/shared/models/item.interface';
import { TaskService } from 'src/app/shared/services/task.service';
import { DialogData } from 'src/app/shared/models/dialog-data.interface';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';



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
   // assigns the dialogData variable to DialogData interface
  dialogData: DialogData;

  // use form builder to build from group
  // set up validations for tasks input
  taskForm: FormGroup = this.fb.group({
    task:[null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(35)])]
  })

  constructor(private taskService: TaskService,
    private cookieService: CookieService,
    private fb: FormBuilder,
    private dialog: MatDialog) {

    // fixed the employee, todo, done, empId, dialogData type errors
    this.employee = {} as Employee;
    this.todo = [];
    this.done = [];
    this.empId = parseInt(this.cookieService.get('session_user'), 10); // from auth.guard.ts
    this.dialogData = {} as DialogData;


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


  deleteTask(taskId: string) {
    // the interface model of header and content is from dialog-data.interface.ts
    this.dialogData.header = 'Delete Record Dialog';
    this.dialogData.content = 'Are you sure you want to delete this task?';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.dialogData,
      disableClose: true
    })

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        console.log(result)

        if (result === 'confirm') {

          this.taskService.deleteTask(this.empId, taskId).subscribe({
            next: (res) => {
              this.employee = res;
            },
            error: (e) => {
              console.log(e);
            },
            complete: () => {
              this.todo = this.employee.todo;
              this.done = this.employee.done;
            }
          })
        }

      }
    })
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      console.log('Item reordered in the same column')

      // write the code to call the update API
    } else {

      console.log('Item moved to the other column');

      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex)

      // write the code to call the update API
      this.updateTaskList(this.empId, this.todo, this.done);

    }
  }


  updateTaskList(empId: number, todo: Item[], done: Item[]) {
    this.taskService.updateTask(empId, todo, done).subscribe({
      next: (res) => {
          this.employee = res;
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {
          this.todo = this.employee.todo;
          this.done = this.employee.done;
        }
    })
  }



}
