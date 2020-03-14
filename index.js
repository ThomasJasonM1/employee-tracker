const inquirer = require('inquirer');
const sql = require('mysql');

const modifyChoices = [
    'Department',
    'Role',
    'Employee'
];

const typesOfModifications = [
    'Add',
    'Edit',
    'Delete',
    'View'
];

const queryTerms = [
    [
        'Department_Name',
        'Department_ID'
    ],
    [
        'Employee_ID',
        'First_Name',
        'Last_Name'
    ],
    [
        'Role_ID',
        'Role_Title',
        'Salary'
    ]
];

const getBaseQuery = (type, table) => {
    switch (type) {
        case 'edit':
            `UPDATE ${}`
            break;
    
        default:
            break;
    }
}

const query = (responses) => {
    let query = getBaseQuery(responses.type.toLowerCase(), response.table.toLowerCase())
};

const askNextQuestion = (responses) => {
    if (responses.table.toLowerCase() !== 'add') {
        let arrayItem = 0;
        let actionFirstWord = responses.table.split(' ')[0].toLowerCase();
        let tableFirstWord = responses.type.split(' ')[0].toLowerCase();

        switch (responses.type.toLowerCase()) {
            case role:
                arrayItem = 1;
                break;
            case employee:
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

        if (responses.type === 'Edit') {
            questions.push([
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
            ]);
        }

        inquirer.prompt(questions).then(choices => {
            responses.queryTerm = choices.queryTerm;
            responses.queryValue = choices.queryValue;

            query(responses);
        });
    } else {

    }
};

const askInitialQuestion = () => {
    inquirer.prompt([
        {
            name: 'type',
            choices: modifyChoices,
            type: 'list',
            message: 'Please choose an option to modify?'
        },
        {
            name: 'table',
            choices: typesOfModifications,
            type: 'list',
            message: 'Please choose an option to modify?'
        }
    ]).then(response => {
        console.log(response);
        askNextQuestion(response);
    });
};

askInitialQuestion();