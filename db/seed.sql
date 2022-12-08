
INSERT INTO department(name)
VALUES('Sales'),
      ('Enginering'),
      ('Finance'),
      ('Legal');

INSERT INTO roles(title, salary,department_id)
VALUES('Sales Lead',100000,1),
      ('Sales Person', 80000,1),
      ('Lead Engineering', 150000,2),
      ('Sofware Engineering', 12000,2),
      ('Account Manager', 160000, 3),
      ('Accountant', 125000, 3),
      ('Legal Team Lead', 250000,4),
      ('Lawyer', 190000,4);

INSERT INTO employees(first_name,last_name,role_id, manager_id, manager_confirm)
VALUES('Francisco','Sanchez',4,1,false),
      ('Alejandro','Ezquivel',3,NULL,true),
      ('Pedro','Avila',2,2,false),
      ('Anilu','Ortiz',1,NULL,true),
      ('Pedro','Nava',6,3,false),
      ('Leticia','Correa',5,NULL,true),
      ('David','Ortiz',8,4,false),
      ('Fernando','Rodriguez',7,NULL,true);

INSERT INTO manager(first_name,last_name)
SELECT first_name, last_name
FROM employees
WHERE manager_confirm = 1;