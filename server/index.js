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

// import employee API
const EmployeeAPI = require("./routes/employee-api");
// import MongoDB database connection string from config.json
const config = require("./data/config.json");

const app = express(); // Express variable.

// import swagger
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

/**
 * App configurations.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../dist/nodebucket")));
app.use("/", express.static(path.join(__dirname, "../dist/nodebucket")));

// default server port value.
const PORT = process.env.PORT || 3000;

// Define MongoDB database connection string from config.json
const CONN = config.dbConn;

/**
 * fixed Mongoose DeprecationWarning:
 * Switched `strictQuery` back to `false` by default in Mongoose 7.
 */
mongoose.set("strictQuery", false);

/**
 * Database connection.
 */
mongoose
  .connect(CONN)
  .then(() => {
    console.log("Connection to the database was successful");
  })
  .catch((err) => {
    console.log("MongoDB Server Error: " + err.message);
  });

mongoose.connection.on("error", (err) => {
  console.log(config.mongoServerError + ": " + err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Server disconnected from host (MongoDB Atlas).");
});

/**
 * APIS go here
 */

/* define an variable object named options for configuring swagger UI */
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WEB450 nodebucket",
      version: "1.0.0",
    },
  },
  apis: ["./server/routes/employee-api.js"], // files containing annotations for the OpenAPI Specification
};

/* call the swaggerJsdoc library using the options object literal. */
const openapiSpecification = swaggerJsdoc(options);
/* wire the openapiSpecification variable to the app variable. Configure express to use /api-docs route to serve swaggerJsdoc  */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification)); // http://localhost:3000/api-docs
// localhost:3000/api/employees/:empId
app.use("/api/employees", EmployeeAPI);

// Wire-up the Express server.
app.listen(PORT, () => {
  console.log("Application started and listening on PORT: " + PORT);
});
