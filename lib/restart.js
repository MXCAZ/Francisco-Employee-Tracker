const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Benito.17",
  database: "employees_db",
});

const removeManager = () => {
  connection.query(`DROP TABLE IF EXISTS manager`, (err, results) => {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log(" ");
  });
};

const createManagerTable = () => {
  connection.query(
    `CREATE TABLE manager (
            id INT NOT NULL AUTO_INCREMENT,
            first_name VARCHAR(30),
            last_name VARCHAR(30),
            PRIMARY KEY (id)
        )`,
    (err, results) => {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log(" ");
    }
  );
};

const addManager = () => {
  connection.query(
    `INSERT INTO manager (first_name, Last_name)
        SELECT first_name, last_name FROM employees
        WHERE manager_confirm = 1`,
    (err, results) => {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log(" ");
    }
  );
};

module.exports = { removeManager, createManagerTable, addManager };
