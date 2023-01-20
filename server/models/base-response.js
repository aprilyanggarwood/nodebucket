/*
 Title: base-response.js
 Author: Professor Krasso
 Date: 01/19/2023
 Modified By: April Yang
 Description: Request/ Response design pattern : Building reusable APIs
 */

// APIs naturally return data, status codes, and messages to the client
class BaseResponse {
  constructor(httpCode, message, data) {
    this.httpCode = httpCode;
    this.message = message;
    this.data = data;
  }

  // Response object: responsible for sending an standard object to all calling clients.
  toObject() {
    return {
      httpCode: this.httpCode,
      message: this.message,
      data: this.data,
      timestamp: new Date().toLocaleDateString("en-US"),
    };
  }
}

// exports BaseResponse
module.exports = BaseResponse;
