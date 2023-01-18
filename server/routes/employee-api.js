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
const { update } = require("../models/employee");

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

/**
 * findAllTasks
 */
router.get("/:empId/tasks", async (req, res) => {
  try {
    Employee.findOne(
      { empId: req.params.empId },
      "empId todo done",
      function (err, emp) {
        if (err) {
          console.log(err);
          res.status(501).send({
            err: config.mongoServerError + ": " + err.message,
          });
        } else {
          console.log(emp);
          res.json(emp);
        }
      }
    );
  } catch (e) {
    console.log(e);
    res.status({
      err: config.serverError + ": " + e.message,
    });
  }
});

/**
 * createTask
 */
router.post("/:empId/tasks", async (req, res) => {
  try {
    Employee.findOne(
      { empId: req.params.empId },
      "empId todo done",
      function (err, emp) {
        if (err) {
          console.log(err);
          res.status(501).send({
            err: config.mongoServerError + ": " + err.message,
          });
        } else {
          console.log(emp);

          /**
           * If the response is not null (a.k.a. emp)
           * Add the newTask
           */

          if (emp) {
            const newTask = {
              text: req.body.text,
            };

            emp.todo.push(newTask);

            emp.save(function (err, updatedEmp) {
              if (err) {
                console.log(err);
                res.status(501).send({
                  err: config.mongoServerError + ": " + err.message,
                });
              } else {
                console.log(updatedEmp);
                res.json(updatedEmp);
              }
            });
          } else {
            /**
             * If the response (a.k.a emp is null)
             */
            res.status(401).send({
              err:
                "EmployeeId: " +
                req.params.empId +
                " does not belong to registered user.",
            });
          }
        }
      }
    );
  } catch (e) {
    console.log(e);
    res.status({
      err: config.serverError + ": " + e.message,
    });
  }
});

module.exports = router;
