const { runApp } = require("../index.js");
const inquirer = require("inquirer");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Benito.17",
  database: "employees_db",
});

const viewAllDepartments = () => {
  connection.query(`SELECT * FROM department`, (err, results) => {
    if (err) {
      console.log(err.message);
      return;
    }
    console.table(results);
    runApp();
  });
};

const addDepartment = () => {
  inquirer
    .prompt({
      type: "text",
      name: "depName",
      message: "Please enter the name of the department you want to add:",
    })
    .then((data) => {
      connection.query(
        `INSERT INTO department (name) VALUES(?)`,
        [data.depName],
        (err, result) => {
          if (err) {
            console.log(err.message);
            return;
          }
          console.log("Added department");
          viewAllDepartments();
        }
      );
    });
};

module.exports = { viewAllDepartments, addDepartment };
