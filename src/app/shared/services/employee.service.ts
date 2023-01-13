/*
Title: employee.service.ts
Author: Professor Krasso
Date: 01/12/2023
Modified By: April Yang
Description: findEmployeeById API
*/




import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


 /**
   * findEmployeeById API
   */
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  findEmployeeById(empId: number): Observable<any>{
    return this.http.get('/api/employees/' + empId)
  }
}
