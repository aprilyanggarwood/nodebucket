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

// Find an employee by ID , findEmployeeById
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

// Find all tasks by empId, findAllTasks
/**
 * @openapi
 * /api/employees/{empId}/tasks:
 *   get:
 *     tags:
 *       - Employees
 *     name: findAllTasks
 *     description: API to show all tasks by empId
 *     summary: Find all tasks by empId
 *     parameters:
 *       - name: empId
 *         in: path
 *         required: true
 *         description: employee's id is created in MongoDB database
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: Employee's all tasks
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/:empId/tasks", async (req, res) => {
  try {
    Employee.findOne(
      /**
       * find one employee by id with three fields: empId, todo, and done
       * return an error message if something wrong with mongo server
       * otherwise return this user's all tasks
       */
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
    // internal Server Error
    console.log(e);
    res.status({
      err: config.serverError + ": " + e.message,
    });
  }
});

// Create a tasks by empId, createTask
/**
 * @openapi
 * /api/employees/{empId}/tasks:
 *   post:
 *     tags:
 *       - Employees
 *     name: createTask
 *     summary: Creates a new task by empId
 *     parameters:
 *        - name: empId
 *          in: path
 *          required: true
 *          description: employee's id is created in MongoDB database
 *          schema:
 *            type: number
 *     requestBody:
 *       description: Creates a new task API by empId
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       '200':
 *         description: New task added to MongoDB
 *       '401':
 *         description: Invalid empId
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post("/:empId/tasks", async (req, res) => {
  try {
    /**
     * find one employee by id
     * return an error message if something wrong with mongo server
     * otherwise return one employee
     */
    Employee.findOne({ empId: req.params.empId }, function (err, emp) {
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
          // if employee creates a new task
          const newTask = {
            text: req.body.text,
          };

          // push the new task to the employee's todo list
          emp.todo.push(newTask);

          // updates employee with the saved new task
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
           * send 401 error message
           */
          res.status(401).send({
            err:
              "EmployeeId: " +
              req.params.empId +
              " does not belong to registered user.",
          });
        }
      }
    });
  } catch (e) {
    // internal Server Error
    console.log(e);
    res.status({
      err: config.serverError + ": " + e.message,
    });
  }
});

module.exports = router;
