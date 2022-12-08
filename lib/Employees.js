const { runApp } = require("../index.js");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const { removeManager, createManagerTable, addManager } = require("./restart");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Benito.17",
  database: "employees_db",
});

const viewAllEmployees = () => {
  connection.query(
    `SELECT employees.id, employees.first_name AS Name, employees.last_name, roles.title AS role, roles.salary AS salary, manager.first_name AS manager,
    department.name AS department FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN department ON roles.department_id = department.id
    LEFT JOIN manager ON employees.manager_id = manager.id`,
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

const viewAllEmployeesDepartment = () => {
  connection.query(`SELECT * FROM department`, (err, results) => {
    if (err) {
      console.log(err.message);
      return;
    }
    depArray = [];
    results.forEach((item) => {
      depArray.push(item.name);
    });
    inquirer
      .prompt({
        type: "list",
        name: "department",
        message: "Select a Department",
        choices: depArray,
      })
      .then((data) => {
        connection.query(
          `SELECT employees.id, employees.first_name AS Name, employees.last_name, department.name As department FROM employees
                    LEFT JOIN roles ON employees.role_id = roles.id
                    LEFT JOIN department ON roles.department_id = department.id
                    WHERE department.name = ?`,
          [data["department"]],
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
const viewAllEmployeesManager = () => {
  connection.query(`SELECT * FROM manager`, (err, results) => {
    if (err) {
      console.log(err.message);
      return;
    }
    managerArray = [];
    results.forEach((item) => {
      managerArray.push(item.first_name);
    });
    inquirer
      .prompt({
        type: "list",
        name: "manager",
        message: "Chose a manager to filter",
        choices: managerArray,
      })
      .then((data) => {
        connection.query(
          `SELECT employees.id, employees.first_name AS Name, employees.last_name, manager.first_name As Manager FROM employees
        LEFT JOIN manager ON employees.manager_id = manager.id
        WHERE manager.first_name = ?`,
          [data["manager"]],
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
const addEmployee = () => {
  connection.query(`SELECT * FROM roles`, (err, results) => {
    if (err) {
      console.log(err.message);
      return;
    }

    let roleArr = [];

    results.forEach((item) => {
      roleArr.push(item.title);
    });

    connection.query(`SELECT * FROM manager`, (err, results) => {
      if (err) {
        console.log(err.message);
        return;
      }

      let manArr = [];

      results.forEach((item) => {
        manArr.push(item.first_name);
      });

      inquirer
        .prompt([
          {
            type: "text",
            name: "first_name",
            message: "What is you employees first name?",
          },
          {
            type: "text",
            name: "last_name",
            message: "What is your employees last name?",
          },
          {
            type: "list",
            name: "role_pick",
            message: "What will you employees role be?",
            choices: roleArr,
          },
          {
            type: "confirm",
            name: "mngt_confirm",
            message: "Is your employees role a manager position?",
          },
          {
            type: "list",
            name: "mngt_pick",
            message: "Who will your employees manager be?",
            when: ({ mngt_confirm }) => {
              if (!mngt_confirm) {
                return true;
              } else {
                return false;
              }
            },
            choices: manArr,
          },
        ])
        .then((data) => {
          let role_id;
          for (i = 0; i < roleArr.length; i++) {
            if (data.role_pick === roleArr[i]) {
              role_id = i + 1;
            }
          }

          let manager_confirm;
          if (data.mngt_confirm === true) {
            manager_confirm = 1;
          } else {
            manager_confirm = 0;
          }

          let manager_id;

          if (!data.mngt_pick) {
            manager_id = null;
          } else {
            for (i = 0; i < manArr.length; i++) {
              if (data.mngt_pick === manArr[i]) {
                manager_id = i + 1;
              }
            }
          }

          connection.query(
            `INSERT INTO employees (first_name, last_name, role_id, manager_id, manager_confirm)
                                  VALUES (?, ?, ?, ?, ?)`,
            [
              data.first_name,
              data.last_name,
              role_id,
              manager_id,
              manager_confirm,
            ],
            (err, results) => {
              if (err) {
                console.log(err.message);
                return;
              }

              console.log("Employee successfully added!");
              removeManager();
              createManagerTable();
              addManager();
              runApp();
            }
          );
        });
    });
  });
};

const updateEmployee = () => {
  connection.query(`SELECT * FROM roles`, (err, results) => {
    if (err) {
      console.log(err.message);
      return;
    }
    let roleArr = [];
    results.forEach((item) => {
      roleArr.push(item.title);
    });
    connection.query(
      `SELECT first_name, last_name FROM employees`,
      (err, results) => {
        if (err) {
          console.log(err.message);
        }
        let nameArr = [];
        results.forEach((item) => {
          nameArr.push(item.first_name);
          nameArr.push(item.last_name);
        });
        let combinedNameArr = [];
        for (let i = 0; i < nameArr.length; i += 2) {
          if (!nameArr[i + 1]) break;
          combinedNameArr.push(`${nameArr[i]} ${nameArr[i + 1]}`);
        }
        inquirer
          .prompt([
            {
              type: "list",
              name: "name_select",
              message: "Please select an employee you would like to update",
              choices: combinedNameArr,
            },
            {
              type: "list",
              name: "role_select",
              message:
                "Please select a role for the employee you like to change",
              choices: roleArr,
            },
          ])
          .then((data) => {
            let role_id;
            for (let i = 0; i < roleArr.length; i++) {
              if (data.role_select === roleArr[i]) {
                role_id = i + 1;
              }
            }
            let selectNameArr = data.name_select.split(" ");
            let last_name = selectNameArr.pop();
            let first_name = selectNameArr[0];

            connection.query(
              `UPDATE employees Set role_id = ?
              WHERE first_name = ? AND last_name = ?`,
              [role_id, first_name, last_name],
              (err, results) => {
                if (err) {
                  console.log(err.message);
                  return;
                }
                console.log("Employee Updated!");
                runApp();
              }
            );
          });
      }
    );
  });
};

module.exports = {
  viewAllEmployees,
  viewAllEmployeesDepartment,
  viewAllEmployeesManager,
  addEmployee,
  updateEmployee,
};
