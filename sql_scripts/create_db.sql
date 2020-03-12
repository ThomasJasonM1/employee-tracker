-- Drops the my_workforce_db if it exists currently --
DROP DATABASE IF EXISTS my_workforce_db;
-- Creates the "my_workforce_db" database --
CREATE DATABASE my_workforce_db;

-- Makes it so all of the following code will affect my_workforce_db --
USE my_workforce_db;

-- Creates the table "department" within my_workforce_db --
CREATE TABLE department (
    department_id INT NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (department_id)
);

-- Creates the table "role" within my_workforce_db --
CREATE TABLE role (
    role_id INT NOT NULL,
    role_title VARCHAR(30) NOT NULL,
    salary DECIMAL(9,2) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id)
        REFERENCES department(department_id),
    PRIMARY KEY (role_id)
);

-- Creates the table "role" within my_workforce_db --
CREATE TABLE employee (
    employee_id INT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id)
        REFERENCES role(role_id),
    manager_id INT,
    FOREIGN KEY (manager_id)
        REFERENCES role(role_id),
    PRIMARY KEY (employee_id)
);
