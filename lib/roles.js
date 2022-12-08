const { runApp } = require("../index");
const mysql = require("mysql2");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Benito.17",
  database: "employees_db",
});

const viewAllRoles = () => {
  connection.query(
    `SELECT roles.id, roles.title, roles.salary, department.name FROM roles
        LEFT JOIN department ON roles.department_id = department.id`,
    (err, results) => {
      if (err) {
        console.log(err.message);
        return;
      }
      console.table(results);
      runApp();
    }
  );
};

const addRole = () => {
  connection.query(`Select * FROM department`, (err, results) => {
    if (err) {
      console.log(err.message);
      return;
    }
    let depARR = [];
    results.forEach((item) => {
      depARR.push(item.name);
    });
    inquirer
      .prompt([
        {
          type: "text",
          name: "role_title",
          message: "Please enter the role you want to add",
        },
        {
          type: "number",
          name: "salary",
          message:
            "Please enter the salary for this role, please do not use commas or periods",
        },
        {
          type: "list",
          name: "department",
          message: "Chose the department you want to add the role",
          choices: depARR,
        },
      ])
      .then((data) => {
        let department_id;

        for (let i = 0; i < depARR.length; i++) {
          if (depARR[i] === data.department) {
            department_id = i + 1;
          }
        }
        connection.query(
          `INSERT INTO roles (title,salary,department_id)
            VALUES(?,?,?)`,
          [data.role_title, data.salary, department_id],
          (err, results) => {
            if (err) {
              console.log(err.message);
              return;
            }
            console.log("Role added!");
            runApp();
          }
        );
      });
  });
};

module.exports = { viewAllRoles, addRole };
