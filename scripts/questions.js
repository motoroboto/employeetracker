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
                "Update Employee's Information",
                "Add a Record",
                "Delete a Record",
                "View Total Department Budget"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Company Records":
                    viewRecords();
                    break;

                case "Update Employee's Information":
                    connection.query("SELECT employee.id, first_name, last_name, job_id, title FROM employee INNER JOIN job ON employee.job_id = job.id;", function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        updateEmployee();
                    });
                    break;

                case "Add a Record":
                    addRecord();
                    break;

                case "Delete a Record":
                    deleteRecord();
                    break;

                case "View Total Department Budget":
                    connection.query("SELECT * FROM department;", function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        viewBudget();
                    });
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
                "Manager's Direct Reports",
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

                case "Manager's Direct Reports":
                    connection.query("SELECT employee.id, first_name, last_name, title, salary FROM employee INNER JOIN job ON employee.job_id = job.id;", function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        findManagerEmployees();
                    });
                    break;

                case "Return to Main Menu":
                    init();
                    break;
            }
        });
};

function updateEmployee() {
    inquirer
        .prompt({

            name: "action",
            type: "list",
            message: "What would you like to update?",
            choices: [
                "Empoyee Role",
                "Employee Manager"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Employee Role":
                    updateEmployeeRole();
                    break;

                case "Employee Manager":
                    updateEmployeeManager();
                    break;
            }

        });
};



function updateEmployeeRole() {
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

function updateEmployeeManager() {
    inquirer.prompt([
        {
            name: "id",
            type: "number",
            message: "Enter the ID of the employee whose role you would like to update",
        },
        {
            name: "manager",
            type: "number",
            message: "Please enter their new Manager's ID number",
        },
    ])
        .then(function (answer) {
            connection.query("UPDATE employee SET ? WHERE ?",
                [{ manager_id: answer.manager }, { id: answer.id }],
                function (err, res) {
                    if (err) throw err;
                    console.log(`Employee ID ${answer.id} updated with Manager ID ${answer.manager}`)
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

function findManagerEmployees() {
    inquirer.prompt([
        {
            name: "manager",
            type: "number",
            message: "Enter the ID of Manager for whom you would like to view Direct Reports",
        },
    ])
        .then(function (answer) {
            connection.query("SELECT * FROM employee WHERE ?",
                [{ manager_id: answer.manager }],
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    init();
                })
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

function deleteRecord() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What records would you like to delete?",
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
                    connection.query("SELECT * FROM department;", function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        deleteDepartment();
                    });
                    break;

                case "Jobs":
                    connection.query("SELECT * FROM job;", function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        deleteJob();
                    });
                    break;

                case "Employees":
                    connection.query("SELECT employee.id, first_name, last_name, job_id, title FROM employee INNER JOIN job ON employee.job_id = job.id;", function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        deleteEmployee();
                    });
                    break;

                case "Return to Main Menu":
                    init();
                    break;
            }
        });
};

function deleteDepartment() {
    inquirer
        .prompt([
            {
                name: "deleted",
                type: "number",
                message: "Please enter the department ID for the Department you would like to delete:"
            },
            {
                name: "confirm",
                type: "list",
                message: "Are you sure you want to delete this Department?",
                choices: ["YES", "NO"]
            },
        ])
        .then(function (answer) {
            switch (answer.confirm) {
                case "YES":
                    connection.query(
                        "DELETE FROM department WHERE ?",
                        { id: answer.deleted },
                        function (err, res) {
                            if (err) throw err;
                            console.log('Department Deleted');
                            init();
                        }
                    );
                    break;

                case "NO":
                    console.log('Okay. No records will be deleted')
                    init();
                    break;
            }
        });
};

function deleteEmployee() {
    inquirer
        .prompt([
            {
                name: "deleted",
                type: "number",
                message: "Please enter the ID for the Employee you would like to delete:"
            },
            {
                name: "confirm",
                type: "list",
                message: "Are you sure you want to delete this Employee?",
                choices: ["YES", "NO"]
            },
        ])
        .then(function (answer) {
            switch (answer.confirm) {
                case "YES":
                    connection.query(
                        "DELETE FROM employee WHERE ?",
                        { id: answer.deleted },
                        function (err, res) {
                            if (err) throw err;
                            console.log('Employee Deleted');
                            init();
                        }
                    );
                    break;

                case "NO":
                    console.log('Okay. No records will be deleted')
                    init();
                    break;
            }
        });
};

function deleteJob() {
    inquirer
        .prompt([
            {
                name: "deleted",
                type: "number",
                message: "Please enter the ID for the Job you would like to delete:"
            },
            {
                name: "confirm",
                type: "list",
                message: "Are you sure you want to delete this Job? (this will also delete all employees with this job)",
                choices: ["YES", "NO"]
            },
        ])
        .then(function (answer) {
            switch (answer.confirm) {
                case "YES":
                    connection.query(
                        "DELETE FROM job WHERE ?",
                        { id: answer.deleted },
                        function (err, res) {
                            if (err) throw err;
                        }
                    );
                    connection.query(
                        "DELETE FROM employee WHERE ?",
                        { job_id: answer.deleted },
                        function (err, res) {
                            if (err) throw err;
                        }
                    );
                    init();

                    break;

                case "NO":
                    console.log('Okay. No records will be deleted')
                    init();
                    break;
            }
        });
};

function viewBudget() {
    inquirer
        .prompt(
            {
                name: "department",
                type: "number",
                message: "Please enter the ID for the department you would like to view the budget of:"
            }
        )
        .then(function (answer) {

            connection.query('SELECT SUM(job.salary) AS "Department_Budget" FROM employee LEFT JOIN job ON employee.job_id = job.id LEFT JOIN department ON job.department_id = department.id WHERE ?',
                { 'department.id': answer.department },
                function (err, res) {
                    if (err) {
                        throw err;
                    } else {
                        console.table(res);
                        init();
                    }
                }
            )

        });
};

module.exports = { init };