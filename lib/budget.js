const mysql = require("mysql2");
const inquirer = require("inquirer");
const { runApp } = require("../index");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Benito.17",
  database: "employees_db",
});

const budgetDepartment = () => {
  connection.query(`SELECT * FROM department`, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    let departmentArray = [];
    result.forEach((item) => {
      departmentArray.push(item.name);
    });
    inquirer
      .prompt({
        type: "list",
        name: "depChoice",
        message:
          "Please Chose a department to see the total amount of money being utilized",
        choices: departmentArray,
      })
      .then((data) => {
        let department_id;
        for (let i = 0; i < departmentArray.length; i++) {
          if (departmentArray[i] === data.depChoice) {
            department_id = i + 1;
          }
        }
        connection.query(
          `SELECT department.name AS department, SUM(roles.salary) AS total_salary
                    FROM employees
                    LEFT JOIN roles ON employees.role_id = roles.id
                    LEFT JOIN department ON roles.department_id = department.id
                    WHERE department_id = ?`,
          [department_id],
          (err, results) => {
            if (err) {
              console.log(err.message);
              return;
            }
            console.table(results);
            runApp();
          }
        );
      });
  });
};

module.exports = { budgetDepartment };
