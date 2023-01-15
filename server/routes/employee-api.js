/*
 Title: employee.api.js
 Author: Professor Krasso
 Date: 01/10/2023
 Modified By: April Yang
 Description: Building employee APIs
 */

// import
const express = require("express");
const Employee = require("../models/employee");
// import reuseable error messages from config.json
const config = require("../data/config.json");

const router = express.Router();

// find an employee by ID , findEmployeeById
/**
 * @openapi
 * /api/employees/{empId}:
 *   get:
 *     tags:
 *       - Employees
 *     name: findEmployeeById
 *     description: Reads,retrieves an employee by id.
 *     summary: Returns a employee by id.
 *     operationId: findEmployeeById
 *     parameters:
 *       - name: empId
 *         in: path
 *         required: true
 *         description: Id to filter the employees collection by.
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: Returned an employee with corresponding Id
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/:empId", async (req, res) => {
  try {
    // find an employee by employee ID, or return an error message
    Employee.findOne({ empId: req.params.empId }, function (err, emp) {
      // if there is a mongodb error, handle it and return a 501 error message
      if (err) {
        console.log(err);
        res.status(501).send({
          err: config.mongoServerError + ": " + err.message,
        });
        // If there is no error, return the emp object from MongoDB
      } else {
        console.log(emp);
        res.json(emp); // returns the data as JSON
      }
    });
  } catch (e) {
    // if there is a server error, handle it and return a 500 error message
    console.log(e);
    res.status(500).send({
      err: config.serverError + ": " + e.message,
    });
  }
});

module.exports = router;
