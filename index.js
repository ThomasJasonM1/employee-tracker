const inquirer = require('inquirer');
const dbQuery = require('./query');

const modifyChoices = [
    'Department',
    'Role',
    'Employee'
];

const typesOfModifications = [
    'Add',
    'Edit',
    'Delete',
    'View',
    'View All'
];

const queryTerms = [
    [
        'department_name',
        'department_id'
    ],
    [
        'role_id',
        'role_title',
        'salary'
    ],
    [
        'employee_ID',
        'first_name',
        'last_name'
    ]
];

const query = (responses) => {
    let sql = '';
    let whereClause = ` where ${responses.queryTerm} = ${responses.queryValue}`;
    let obj = {};

    switch (responses.type.toLowerCase()) {
        case 'edit':
            sql = `UPDATE ${responses.table.toLowerCase()} set ${responses.whatToUpdate} = ?`;
            obj = [responses.newValue];
            break;
        case 'delete':
            sql = `delete from ${responses.table.toLowerCase()}`;
            break;
        case 'view':
            sql = `select * from ${responses.table.toLowerCase()}`;
            console.log(sql);
            break;
        default:
            sql = 
                `SELECT e.employee_id, e.first_name, e.last_name, r.role_title, r.salary, d.department_name
                FROM employee e 
                join role r on e.role_id = r.role_id 
                join department d on d.department_id = r.department_id`;
            break;
    }

        if (responses.type != 'View All') sql += whereClause;
        dbQuery(sql, obj, (res) => {
            console.log(res);
            askInitialQuestion();
        })
};

const askNextQuestion = (responses) => {
    if (responses.type.toLowerCase() !== 'add') {
        let arrayItem = 0;
        let actionFirstWord = responses.type.split(' ')[0].toLowerCase();
        let tableFirstWord = responses.table.split(' ')[0].toLowerCase();

        switch (responses.table.toLowerCase()) {
            case 'role':
                arrayItem = 1;
                break;
            case 'employee':
                arrayItem = 2;
                break;
            default:
                break;
        }

        let questions = [
            {
                name: 'queryTerm',
                message: `What search term would you like to use in order to ${actionFirstWord} your ${tableFirstWord}`,
                type: 'list',
                choices: queryTerms[arrayItem]
            },
            {
                name: 'queryValue',
                message: 'Please enter your search term:',
                type: 'input',
            }
        ];

        if (responses.type == 'Edit') {
            questions.push(
                {
                    name: 'whatToUpdate',
                    message: 'What would you like to update:',
                    type: 'list',
                    choices: queryTerms[arrayItem]
                },
                {
                    name: 'newValue',
                    message: 'What would you like set it to:',
                    type: 'input'
                }
            )
        }

        inquirer.prompt(questions).then(choices => {
            responses.queryTerm = choices.queryTerm;
            responses.queryValue = choices.queryValue;
            responses.whatToUpdate = choices.whatToUpdate;
            responses.newValue = choices.newValue;

            query(responses);
        });
    } else {
        let questions;
        let table = responses.table.toLowerCase();
        switch (table) {
            case 'department':
                questions = [
                    {
                        name: 'departmentID',
                        type: 'input',
                        message: 'Please enter a departmentID:'
                    },
                    {
                        name: 'departmentName',
                        type: 'input',
                        message: 'Please enter a department name:'
                    }
                ]
                break;
            case 'role':
                questions = [
                    {
                        name: 'roleID',
                        type: 'input',
                        message: 'Please enter a roleID:'
                    },
                    {
                        name: 'roleTitle',
                        type: 'input',
                        message: 'Please enter a role title:'
                    },
                    {
                        name: 'salary',
                        type: 'input',
                        message: 'Please enter a role salary:'
                    },
                    {
                        name: 'departmentID',
                        type: 'input',
                        message: 'Please enter a departmentID:'
                    }
                ];
                break;
            default:
                    questions = [
                        {
                            name: 'employeeID',
                            type: 'input',
                            message: 'Please enter a employeeID:'
                        },
                        {
                            name: 'firstName',
                            type: 'input',
                            message: 'Please enter a employee first name:'
                        },
                        {
                            name: 'lastName',
                            type: 'input',
                            message: 'Please enter a employee last name:'
                        },
                        {
                            name: 'roleID',
                            type: 'input',
                            message: 'Please enter a roleID:'
                        },
                        {
                            name: 'managerID',
                            type: 'input',
                            message: 'Please enter a managerID:'
                        }
                    ]
                break;
        }
        inquirer.prompt(questions)
        .then(answers => {
            let sql = `INSERT INTO ${table} SET ? `;
            let obj;
            switch (table) {
                case 'department':
                    obj = {
                        department_name: answers.departmentName,
                        department_id: answers.departmentID,
                    } 
                    break;
                case 'role':
                    obj = {
                        role_id: answers.roleID,
                        role_title: answers.roleTitle,
                        salary: answers.salary,
                        department_id: answers.departmentID,
                    }
                    break;
                default:
                    obj = {
                        employee_id: answers.employeeID,
                        first_name: answers.firstName,
                        last_name: answers.lastName, 
                        role_id: answers.roleID,
                        manager_id: answers.managerID,
                    }
                    break;
            };
            dbQuery(sql, obj, (queryResponse => {
                console.log(queryResponse);
                askInitialQuestion();
            })) 
        })
    }
};

const askInitialQuestion = () => {
    inquirer.prompt([
        {
            name: 'table',
            choices: modifyChoices,
            type: 'list',
            message: 'Please choose an option to modify?'
        },
        {
            name: 'type',
            choices: typesOfModifications,
            type: 'list',
            message: 'Please choose an option to modify?'
        }
    ]).then(response => {
        console.log(response);
        if (response.type == 'View All') {
            query(response);
        } else {
            askNextQuestion(response);
        }
    });
};

askInitialQuestion();