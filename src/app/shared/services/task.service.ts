/*
Title: task.service.ts
Author: Professor Krasso
Date: 01/19/2023
Modified By: April Yang
Description: findEmployeeById API
*/

// import
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/item.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }
  // use HttpClient service to observable and return all tasks url by empId
  findAllTasks(empId: number): Observable<any> {
    return this.http.get('/api/employees/' + empId + '/tasks');
  }

  // use HttpClient service to observable and create a new task by empId
  createTask(empId: number, task: string): Observable<any>{
    return this.http.post('/api/employees/' + empId + '/tasks', {
      text: task // task from creating task form - home.component.ts
    })
  }


  updateTask(empId: number, todo: Item[], done:Item[]): Observable<any> {
    return this.http.put('/api/employees/' + empId + '/tasks', {
      todo,
      done
    })
  }

// taskId: string
  deleteTask(empId: number, taskId: string): Observable<any>{
    return this.http.delete('/api/employees/' + empId + '/tasks/' + taskId)

  }

}
