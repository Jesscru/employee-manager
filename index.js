const mysql = require("mysql");
const inquirer = require('inquirer');
const { start } = require("repl");
// const cTable = require('console.table');


var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "Pass37word",
  database: "employee_manager_db"
});


// connection to mysql
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  startPrompt();
});


// starts the prompt for the user
function startPrompt(){
    inquirer
    .prompt([
        {
        type: 'list',
        message: 'What would you like to do?',
        name: 'start',
        choices: [
            "View All Employees",
            "Add an Employee",
            "Remove an Employee",
            "Update An Employee Role",
            "Exit", 
            // "Update Existing employee",
            // "View Employees by Department",
            // "View Employees by Manager", 
            // "Update a Manager", 
        ]
        },
    ]).then(data => {
        console.log(data.start);
        if (data.start === "View All Employees") {
            viewAllEmployees();
        } else if (data.start === "Add an Employee") { 
            createEmployee();
        } else if (data.start === "Remove an Employee") { 
            removeEmployee();
        } else if (data.start === "Update An Employee Role") { 
            updateEmployeeRole();
        // } else if (data.start === "Update Existing employee") { 
        //   updateEmployee();
        // } else if (data.start === "View Employees by Department") { 
        //     makePost();
        // } else if (data.start === "View Employees by Manager") { 
        //     makePost();
        } else {
            connection.end();
            }
        // }
    });
}

// list all the employees
function viewAllEmployees() {
  let query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department'
  query += ' FROM employee';
  query += ' INNER JOIN role ON employee.role_id = role.id'
  query += ' INNER JOIN department ON role.department_id = department.id';
  
    connection.query(query, function(err, res) {
      if (err) throw err;
      
      for (var i = 0; i < res.length; i++) {
        console.log(console.table(res));
      }
      startPrompt()
    });
    
  }

// add an employee to the roster
  function createEmployee() {

    inquirer.prompt([
    {
      type: 'input',
      message: 'What is the employee\'s first name?',
      name: 'name'
    },
    {
        type: 'input',
        message: 'What is the employee\'s last name?',
        name: 'surname'
    },
    {
        type: 'list',
        message: 'What is the employee\'s role?',
        name: 'role',
        choices: [
            "Salesperson",
            "Software Engineer",
            "Sales Lead",
            "Accountant",
            "Account Manager",
            "Legal Team Lead",
            "Lead Engineer"
        ]
    },
  ]).then(data => {
    var query = connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: data.name,
          last_name: data.surname, 
        },
        function(err, res) {
          if (err) throw err;
        }
      );
      var query2 = connection.query(
        "INSERT INTO role SET ?",
        {
          title: data.role
        },
        function(err, res) {
          if (err) throw err;
        }
      );
      console.log("New team member added.");
      startPrompt();
  });
}


// remove an employee from the roster
function removeEmployee() {
  connection.query("SELECT * FROM employee", function(err, results) {
    if (err) throw err;
    inquirer.prompt([
    {
        type: 'rawlist',
        message: 'Which employee would you like to remove?',
        choices: function() {
            var employeeArray = [];
            for (var i = 0; i < results.length; i++) {
              employeeArray.push(results[i].last_name);
            }
            return employeeArray;
          },
        name: 'remove',
    }
  ]).then(data => {
    var query = connection.query(
        "DELETE FROM employee WHERE ?",
        {
          last_name: data.remove
        },
        function(err, res) {
          if (err) throw err;
          console.log(`Employee has been removed from the roster.`);
          startPrompt();
          }
      );
    });
  })
}

// update employee's data
function updateEmployeeRole(){
  connection.query("SELECT * FROM employee", function(err, results) {
  inquirer.prompt([
    {
        type: 'rawlist',
        message: 'Which employee would you like to update?',
        choices: function() {
            var employeeArray = [];
            for (var i = 0; i < results.length; i++) {
              employeeArray.push(results[i].last_name);
            }
            return employeeArray;
          },
        name: 'update'
    },
    {
      type: 'list',
      message: 'What is the employee\'s new roll?',
      choices: ["Sales Lead", "Sales Person", "Lead Engineer", "Software Engineer", "Accountant", "Legal Team Lead", "Lawyer"],
      name: 'newRole'
    }
  ]).then(data => {
    var query = connection.query(
      "UPDATE role SET ? WHERE ?",
      [
        {
          title: data.newRole
        },
        {
          // title: data.newRole
        }
      ],
      function(error) {
        if (error) throw err;
        console.log('Employee\'s role has been updated.')
        startPrompt();
        }
      );
    })
  })
}
