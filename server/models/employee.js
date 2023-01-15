/*
 Title: employee.js
 Author: Professor Krasso
 Date: 01/10/2023
 Modified By: April Yang
 Description: Creating employee Schema with mongoose
 */

// import
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create the model of employeeSchema to use with mongoose
let employeeSchema = new Schema(
  {
    empId: { type: Number, unique: true, require: true },
    firstName: { type: String },
    lastName: { type: String },
  },
  { collection: "employees" } // pre-build collection in mongodb atlas
);

// export employeeSchema
module.exports = mongoose.model("Employee", employeeSchema);
