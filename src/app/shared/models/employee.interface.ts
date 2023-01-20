/*
Title: employee.interface.ts
Author: Professor Krasso
Date: 01/12/2023
Modified By: April Yang
Description: Create model for employee interface
*/

// import item interface
import { Item } from "./item.interface";

export interface Employee {
  empId: number;
  firstName: string;
  lastName: string;
  todo: Item[];
  done: Item[];

}
