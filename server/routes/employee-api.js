/*
 Title: employee.api.js
 Author: Professor Krasso
 Date: 01/10/2023
 Modified By: April Yang
 Description: Building employee APIs
 */

const express = require("express");
const Employee = require("../models/employee");

const router = express.Router();

/**
 * findEmployeeId
 */
router.get("/:empId", async (req, res) => {
  try {
    Employee.findOne({ empId: req.params.empId }, function (err, emp) {
      /**
       * if there is a mongodb error, handle it and return a 501 error message
       */
      if (err) {
        console.log(err);
        res.status(501).send({
          err: "MongoDB server error: " + err.message,
        });
        /**
         * If there is no error, return the emp object from MongoDB
         */
      } else {
        console.log(emp);
        res.json(emp); // returns the data as JSON
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      err: "Internal server error!",
    });
  }
});
