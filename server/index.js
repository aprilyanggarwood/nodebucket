/*
Title: index.js
Author: Professor Krasso
Date: 01/03/2023
Modified By: April Yang
Description: App Server File
*/

/**
 * Require statements
 */
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const EmployeeAPI = require("./routes/employee-api");

const app = express(); // Express variable.

/**
 * App configurations.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../dist/nodebucket")));
app.use("/", express.static(path.join(__dirname, "../dist/nodebucket")));

// default server port value.
const PORT = process.env.PORT || 3000;

// TODO: This line will be replaced with your database connection string (including username/password).
const CONN =
  "mongodb+srv://nodebucket_user:s3cret@cluster0.vvn3y4f.mongodb.net/nodebucket?retryWrites=true&w=majority";

/**
 * Database connection.
 */
mongoose
  .connect(CONN)
  .then(() => {
    console.log("Connection to the database was successful");
  })
  .catch((err) => {
    console.log("MongoDB Error: " + err.message);
  });

/**
 * APIS go here
 */

app.use("/api/employees", EmployeeAPI); // localhost:3000/api/employees/:empId

// Wire-up the Express server.
app.listen(PORT, () => {
  console.log("Application started and listening on PORT: " + PORT);
});
