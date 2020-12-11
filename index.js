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
            "Update Existing employee",
            "View Employees by Department",
            "View Employees by Manager",
            "Add an Employee",
            "Remove an Employee",
            "Update An Employee Role",
            "Update a Manager", 
            "Exit"
        ]
        },
    ]).then(data => {
        console.log(data.start);
        if (data.start === "View All Employees") {
            queryAllEmployees();
        } else if (data.start === "Update Existing employee") { 
            updateEmployee();
        // } else if (data.start === "View Employees by Department") { 
        //     makePost();
        // } else if (data.start === "View Employees by Manager") { 
        //     makePost();
        } else if (data.start === "Add an Employee") { 
            createEmployee();
        } else if (data.start === "Remove an Employee") { 
            removeEmployee();
        // } else if (data.start === "Update An Employee Role") { 
        //     updateEmployee();
        // } else if ("Update a Manager") {
        //     buildTeam();
        } else {
            connection.end();
            }
        // }
    });
}

// list all the employees
function queryAllEmployees() {
    connection.query("SELECT * FROM employee", function(err, res) {
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
        "INSERT INTO role SET ?",
        {
          title: data.role
        },
        function(err, res) {
          if (err) throw err;
          console.log(query.values);
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
          last_name: data.surname
        },
        function(err, res) {
          if (err) throw err;
          console.log(query.values);
          }
      );
    });
  })
}

// update employee's data
function updateEmployee (){
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
        name: 'update',
        
    },
  ]).then(data => {
    var query = connection.query(
      "UPDATE employee SET ? WHERE ?",
      [
        {
         first_name: data.name,
         last_name: data.surname
        },
      ],

        "UPDATE employee SET ? WHERE ?",
      [
        {
          title: role.title
        }
      ],
      function(error) {
        if (error) throw err;
        console.log(query.values);
        }
      );
    })
  })
}
