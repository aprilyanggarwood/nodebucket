/*
 Title: employee.js
 Author: Professor Krasso
 Date: 01/10/2023
 Modified By: April Yang
 Description: Building employee Schema with mongoose
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let employeeSchema = new Schema(
  {
    empId: { type: Number, unique: true, require: true },
    firstName: { type: String },
    lastName: { type: String },
  },
  { collection: "employees" } // pre-build collection in mongodb atlas
);

module.exports = mongoose.model("Employee", employeeSchema);
