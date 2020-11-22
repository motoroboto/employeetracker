const inquirer = require("inquirer");
const connection = require("./connection");

function init() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Company Records",
                "Update Employee Roles",
                "Add a Record"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Company Records":
                    viewRecords();
                    break;
                case "Update Employee Roles":
                    connection.query("SELECT employee.id, first_name, last_name, job_id, title FROM employee INNER JOIN job ON employee.job_id = job.id;", function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        updateEmployee();
                    });
                    break;
                case "Add a Record":
                    addRecord();
                    break;
            }
        })
};

function viewRecords() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What records would you like to view?",
            choices: [
                "Departments",
                "Jobs",
                "Employees",
                "Return to Main Menu"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Departments":
                    findDepartment();
                    break;

                case "Jobs":
                    findJob();
                    break;

                case "Employees":
                    findEmployee();
                    break;

                case "Return to Main Menu":
                    init();
                    break;
            }
        });
};

function updateEmployee() {
    inquirer.prompt([
        {
            name: "id",
            type: "number",
            message: "Enter the ID of the employee whose role you would like to update",
        },
        {
            name: "jobID",
            type: "number",
            message: "Please enter their new Job ID number",
        },
    ])
        .then(function (answer) {
            connection.query("UPDATE employee SET ? WHERE ?",
                [{ job_id: answer.jobID }, { id: answer.id }],
                function (err, res) {
                    if (err) throw err;
                    console.log(`Employee ID ${answer.id} updated with Job ID ${answer.jobID}`)
                    init();
                }
            )
        }
        );
};

function addRecord() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What kind of record would you like to add?",
            choices: [
                "Department",
                "Job",
                "Employee",
                "Return to Main Menu"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Department":
                    addDepartment();
                    break;

                case "Job":
                    addJob();
                    break;

                case "Employee":
                    addEmployee();
                    break;

                case "Return to Main Menu":
                    init();
                    break;
            }
        });
};


function findDepartment() {
    connection.query("SELECT * FROM department;", function (err, res) {
        if (err) throw err;
        console.table(res);
        init();
    });
};

function findJob() {
    connection.query("SELECT job.id, title, salary, name FROM job INNER JOIN department ON department_id = department.id;", function (err, res) {
        if (err) throw err;
        console.table(res);
        init();
    });
};

function findEmployee() {
    connection.query("SELECT employee.id, first_name, last_name, title, salary FROM employee INNER JOIN job ON employee.job_id = job.id;", function (err, res) {
        if (err) throw err;
        console.table(res);
        init();
    });
};

function addDepartment() {
    inquirer.prompt([
        {
            name: "departmentID",
            type: "input",
            message: "Enter the name of the department you would like to add:",
        }
    ])
        .then(function (answer) {
            connection.query("INSERT INTO department SET ?",
                { name: answer.departmentID },
                function (err, res) {
                    if (err) throw err;
                    console.log(`Department ${answer.departmentID} successfully added!`)
                    init();
                }
            )
        }
        );
};

function addJob() {
    connection.query("SELECT * FROM department;", function (err, res) {
        if (err) throw err;
        console.table(res);
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "What is the title of the job you would like to add:",
            },
            {
                name: "salary",
                type: "number",
                message: "What is the salary for this position (numbers only):",
            },
            {
                name: "departmentID",
                type: "number",
                message: "What is the number for this positions department:",
            },
        ])
            .then(function (answer) {
                console.log(answer)
                connection.query("INSERT INTO job SET ?",
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: answer.departmentID
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log(`Job ${answer.title} with salary $ ${answer.salary} in department ${answer.departmentID} added!`)
                        init();
                    }
                )
            }
            );
    });
};


function addEmployee() {
    connection.query("SELECT job.id, title, salary, name FROM job INNER JOIN department ON department_id = department.id;", function (err, res) {
        if (err) throw err;
        console.table(res);
        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the employee's First Name:",
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the employee's Last Name:",
            },
            {
                name: "jobID",
                type: "number",
                message: "What is the employee's Job ID Number:",
            },
            {
                name: "managerID",
                type: "number",
                message: "What is the Manager ID Number for this employee's manager?",
            }
        ])
            .then(function (answer) {
                console.log(answer)
                connection.query("INSERT INTO employee SET ?",
                    {
                        first_name: answer.firstName,
                        last_name: answer.lastName,
                        job_id: answer.jobID,
                        manager_id: answer.managerID
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log(`New employee: ${answer.firstName} ${answer.lastName} with Job ID ${answer.jobID} and Manager with an ID of ${answer.managerID}`)
                        init();
                    }
                )
            }
            );
    });
};

module.exports = {
    init,
    viewRecords,
    addRecord,
    updateEmployee
};