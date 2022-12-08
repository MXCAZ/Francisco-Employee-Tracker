const mysql = require("mysql2");
const inquirer = require("inquirer");
const { viewAllEmployees } = require("./Employees");

const { viewAllDepartments } = require("./Department");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Benito.17",
  database: "employees_db",
});

const deleteEmployee = () => {
  connection.query(`SELECT * FROM employees`, (err, results) => {
    if (err) {
      console.log(err.message);
    }
    const employee = results.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee_delete",
          message: "Which a employee you want to delete",
          choices: employee,
        },
      ])
      .then((data) => {
        connection.query(
          `DELETE FROM employees WHERE id = ?`,
          [data.employee_delete],
          (err, results) => {
            if (err) {
              console.log(err.message);
              return;
            }
            console.log("Successfully deleted");
            viewAllEmployees();
          }
        );
      });
  });
};

const deleteDepartment = () => {
  connection.query(`SELECT * FROM department`, (err, results) => {
    if (err) {
      console.log(err.message);
    }
    const department = results.map(({ id, name }) => ({
      name: name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "department_delete",
          message: "Which a department you want to delete",
          choices: department,
        },
      ])
      .then((data) => {
        connection.query(
          `DELETE FROM department WHERE id = ?`,
          [data.department_delete],
          (err, results) => {
            if (err) {
              console.log(err.message);
              return;
            }
            console.log("Successfully deleted");
            viewAllDepartments();
          }
        );
      });
  });
};

const deleteRoles = () => {
  connection.promise().query(`SELECT * FROM roles`, (err, results) => {
    if (err) {
      console.log(err.message);
    }
    const roles = results.map(({ id, title }) => ({
      name: title,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "role_delete",
          message: "Which a role you want to delete",
          choices: roles,
        },
      ])
      .then((data) => {
        connection.query(
          `DELETE FROM roles WHERE id = ?`,
          [data.role_delete],
          (err, results) => {
            if (err) {
              console.log(err.message);
              return;
            }
            console.log("Successfully deleted");
            viewAllRoles();
          }
        );
      });
  });
};

module.exports = { deleteEmployee, deleteDepartment, deleteRoles };
