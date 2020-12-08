-- Drops the programming_db if it already exists --
DROP DATABASE IF EXISTS employee_manager_db;

-- Created the DB "employee_manager_db" (only works on local connections)
CREATE DATABASE employee_manager_db;

-- Use the DB employee_manager_db for all the rest of the script
USE employee_manager_db;

-- Created the table "department"
CREATE TABLE department (
  id int AUTO_INCREMENT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY(id)
);


-- Created the table "role"
CREATE TABLE role (
  id int AUTO_INCREMENT NOT NULL,
  title varchar(30) NOT NULL,
  salary DECIMAL(5,2),
  department_id INT(30),
  PRIMARY KEY(id)
);


-- Created the table "employee"
CREATE TABLE employee (
  id int AUTO_INCREMENT NOT NULL,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) NOT NULL,
  role_id INT(10),
  manager_id INT(30),
  PRIMARY KEY(id)
);