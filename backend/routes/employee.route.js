const express = require("express");
const app = express();
const employeeRoute = express.Router();
const cors = require("cors");

// CORS OPTIONS
var whitelist = ["http://localhost:4200", "http://localhost:4000"];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    };
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions);
};

// Employee model
let Employee = require("../models/Employee");

// Add Employee
employeeRoute.route("/create").post(async (req, res, next) => {
  await Employee.create(req.body)
    .then((result) => {
      res.json({
        data: result,
        message: "Data successfully added!",
        status: 200,
      });
    })
    .catch((err) => {
      return next(err);
    });
});

// Get All Employees
employeeRoute
  .route("/", cors(corsOptionsDelegate))
  .get(async (req, res, next) => {
    await Employee.find()
      .then((result) => {
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      })
      .catch((err) => {
        return next(err);
      });
  });

// Get single employee
employeeRoute.route("/read/:id").get(async (req, res, next) => {
  await Employee.findById(req.params.id, req.body)
    .then((result) => {
      res.json({
        data: result,
        message: "Data successfully retrieved.",
        status: 200,
      });
    })
    .catch((err) => {
      return next(err);
    });
});

// Update employee
employeeRoute.route("/update/:id").put(async (req, res, next) => {
  await Employee.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  })
    .then((result) => {
      res.json({
        data: result,
        msg: "Data successfully updated.",
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Delete employee
employeeRoute.route("/delete/:id").delete(async (req, res) => {
  await Employee.findByIdAndRemove(req.params.id)
    .then(() => {
      res.json({
        msg: "Data successfully updated.",
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = employeeRoute;
