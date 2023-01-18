/*
 Title: employee.js
 Author: Professor Krasso
 Date: 01/17/2023
 Modified By: April Yang
 Description: Creating item Schema with mongoose
 */

// import
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create the model of itemSchema to use with mongoose
let itemSchema = new Schema({
  text: { type: String },
});

// export itemSchema
module.exports = itemSchema;
