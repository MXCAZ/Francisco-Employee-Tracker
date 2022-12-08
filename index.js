const inquirer = require("inquirer");
var figlet = require("figlet");
const chalk = require("chalk");

console.log(
  chalk.blackBright.bold(
    `====================================================================================`
  )
);
console.log(chalk.magenta.bgCyan.bold(figlet.textSync("Employee Tracker")));
console.log(
  chalk.blackBright.bold(
    `====================================================================================`
  )
);

const runApp = () => {
  inquirer
    .prompt({
      type: "list",
      name: "Begin Choices",
      message: "What would you like to do? (use arrow keys)",
      choices: [
        "View all Departments",
        "Add a department",
        "View all Employees",
        "View all Employees by Department",
        "View All Employees by Manager",
        "Add Employee",
        "Update Employee Role",
        "View all roles",
        "Add a role",
        "View the total utilized budget of a department",
        "Delete Employee",
        "Delete Roles",
        "Delete Department",
        "I am finished",
      ],
    })
    .then((answer) => {
      switch (answer["Begin Choices"]) {
        case "View all Departments":
          viewAllDepartments();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "View all Employees":
          viewAllEmployees();
          break;
        case "View all Employees by Department":
          viewAllEmployeesDepartment();
          break;
        case "View All Employees by Manager":
          viewAllEmployeesManager();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateEmployee();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "Add a role":
          addRole();
          break;
        case "View the total utilized budget of a department":
          budgetDepartment();
          break;
        case "Delete Employee":
          deleteEmployee();
          break;
        case "Delete Roles":
          deleteRoles();
          break;
        case "Delete Department":
          deleteDepartment();
          break;
        case "I am finished":
          break;
      }
    });
};

module.exports = { runApp };

runApp();

const { viewAllDepartments, addDepartment } = require("./lib/Department");
const {
  viewAllEmployees,
  viewAllEmployeesDepartment,
  viewAllEmployeesManager,
  addEmployee,
  updateEmployee,
} = require("./lib/Employees");
const { budgetDepartment } = require("./lib/budget");
const { viewAllRoles, addRole } = require("./lib/roles");
const {
  deleteEmployee,
  deleteDepartment,
  deleteRoles,
} = require("./lib/deleteEmployee");
