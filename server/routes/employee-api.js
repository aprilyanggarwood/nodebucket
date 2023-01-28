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
// building reusable APIs
const BaseResponse = require("../models/base-response");

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
        const findEmployeeByIdMongoDBErrorResponse = new BaseResponse(
          501,
          `${config.mongoServerError}:${err.message}`,
          null
        );

        console.log(findEmployeeByIdMongoDBErrorResponse.toObject());
        res.status(501).send(findEmployeeByIdMongoDBErrorResponse.toObject());

        /*console.log(err);
        res.status(501).send({
          err: config.mongoServerError + ": " + err.message,
        });*/

        // If there is no error, return the emp object from MongoDB
      } else {
        const findEmployeeByIdResponse = new BaseResponse(
          200,
          `findAll query was successful.`,
          emp
        );
        console.log(findEmployeeByIdResponse.toObject());
        res.json(findEmployeeByIdResponse.toObject());

        // console.log(emp);
        // res.json(emp); // returns the data as JSON
      }
    });
  } catch (e) {
    const errorResponse = new BaseResponse(
      500,
      `${config.serverError}:${err.message}`,
      null
    );
    console.log(errorResponse.toObject());
    res.status(500).send(errorResponse.toObject());

    // if there is a server error, handle it and return a 500 error message
    /*
    console.log(e);
    res.status(500).send({
      err: config.serverError + ": " + e.message,
    }); */
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

          // updates employee with the saved new to do task
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

// updateTasks
/**
 * @openapi
 *
 * /api/employees/{empId}/tasks:
 *   put:
 *     tags:
 *       - Employees
 *     description: Finds an employee by Id and update this employee's to do list or done list
 *     summary: updates a task for an empId
 *     operationId: updateTasks
 *     parameters:
 *       - name: empId
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - todo
 *               - done
 *             properties:
 *               todo:
 *                 type: array
 *               done:
 *                 type: array
 *     responses:
 *       '200':
 *         description: A task gets updated
 *       '401':
 *         description: Invalid empId
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.put("/:empId/tasks", async (req, res) => {
  /**
   * find one employee by id
   * return an error message if something wrong with mongo server
   * otherwise return one employee
   */
  try {
    Employee.findOne({ empId: req.params.empId }, function (err, emp) {
      if (err) {
        console.log(err);
        res.status(501).send({
          err: "MongoDB server error: " + err.message,
        });
      } else {
        console.log(emp);

        /**
         * update employees's todo and done items
         * return an error message if something wrong with mongo server
         * otherwise return updated employee's todo and done list array
         */
        if (emp) {
          emp.set({
            todo: req.body.todo,
            done: req.body.done,
          });

          emp.save(function (err, updatedEmp) {
            if (err) {
              console.log(err);
              res.status(501).send({
                err: "MongoDB server error: " + err.message,
              });
            } else {
              console.log(updatedEmp);
              res.json(updatedEmp);
            }
          });
        } else {
          console.log(
            "no employee matching the passed-in empId: " + req.params.empId
          );
          /**
           * If the response (a.k.a emp is null)
           * send 401 error message
           */
          res.status(401).send({
            err:
              "EmployeeId: " +
              req.params.empId +
              " does not belong to the registered user.",
          });
        }
      }
    });
  } catch (e) {
    console.log(e);
    // internal Server Error
    res.status(500).send({
      err: "Internal server error: " + e.message,
    });
  }
});

// deleteTask
/**
 * @openapi
 * /api/employees/{empId}/tasks/{taskId}:
 *   delete:
 *     tags:
 *       - Employees
 *     description: Finds an employee by empId and delete one task by taskId from this employee's to do list or done list
 *     summary: deletes a taskId for an empId
 *     operationId: deleteTask
 *     parameters:
 *       - name: empId
 *         in: path
 *         required: true
 *         scheme:
 *           type: number
 *       - name: taskId
 *         in: path
 *         required: true
 *         scheme:
 *           type: string
 *     responses:
 *       '200':
 *         description: A task gets deleted
 *       '401':
 *          description: Invalid empId or taskId
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.delete("/:empId/tasks/:taskId", async (req, res) => {
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
          err: "MongoDB server error: " + err.message,
        });
      } else {
        console.log(emp);
        /**
         * delete an employee's todo task or done task by taskId
         * return an error message if something wrong with mongo server
         * otherwise return updated employee's todo and done list array
         */
        if (emp) {
          // set up taskId as a required parameter to variable taskId
          const taskId = req.params.taskId;
          // find one todo item or done item by item._id
          // item._id.toString() equal to taskId string
          const todoItem = emp.todo.find(
            (item) => item._id.toString() === taskId
          );
          const doneItem = emp.done.find(
            (item) => item._id.toString() === taskId
          );
          /**
           * if find a task in the todo list array , delete it from array and update array database

           */
          if (todoItem) {
            emp.todo.id(todoItem._id).remove();

            emp.save(function (err, updatedTodoItemEmp) {
              if (err) {
                console.log(err);
                res.status(501).send({
                  err: "MongoDB server error: " + err.message,
                });
              } else {
                console.log(updatedTodoItemEmp);
                res.json(updatedTodoItemEmp);
              }
            });
          } else if (doneItem) {
            /**
             * if find a task in the done list array, delete it from array and update array database
             * return an error message if something wrong with mongo server
             */
            emp.done.id(doneItem._id).remove();

            emp.save(function (err, updatedDoneItemEmp) {
              if (err) {
                console.log(err);
                res.status(501).send({
                  err: "MongoDB server error: " + err.message,
                });
              } else {
                console.log(updatedDoneItemEmp);
                res.json(updatedDoneItemEmp);
              }
            });
          } else {
            /**
             * If the response (a.k.a taskId is null)
             * send 401 error message
             */
            console.log("Invalid taskId: " + taskId);
            res.status(401).send({
              err: "Invalid taskId: " + taskId,
            });
          }
        } else {
          console.log(
            "no employee matching the passed- in empId: " + req.params.empId
          );
          /**
           * If the response (a.k.a emp is null)
           * send 401 error message
           */
          res.status(401).send({
            err:
              "EmployeeId: " +
              req.params.empId +
              "does not belong to the register user.",
          });
        }
      }
    });
  } catch (e) {
    console.log(e);
    res.status(501).send({
      err: "MongoDB server error: " + err.message,
    });
  }
});

// exports the module
module.exports = router;
