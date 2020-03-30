const dataAccessLayer = require("./config/dal.js");
const inquirer = require(`inquirer`);

const prompts = {
    firstaction: () => {
        return new Promise((resolve, reject) => {

            inquirer
                .prompt([
                    {
                        type: `list`,
                        name: `firstaction`,
                        message: `What would you like to do?`,
                        choices: [
                            `View Departments`,
                            `View Employees`,
                            `View Roles`,
                            `Add Department`,
                            `Add Employee`,
                            `Add Role`,
                            `Update Employee Role`,
                            `Exit Application`
                        ]
                    }
                ]).then(({firstaction}) => {
                    mainMenu(firstaction);
                })
                .catch(() => {
                    console.log(`\nSomething went wrong... please try again.\n`);
                    process.exit(1);
                })
        });

    },

    newDepartment: () => {
        return new Promise((resolve, reject) => {

            inquirer
                .prompt([
                    {
                        type: `input`,
                        message: `What is the Department Title?`,
                        name: `departmentname`
                    }
                ]).then(({departmentname}) => {
                    return resolve(dataAccessLayer.create([`name`], [departmentname], [`department`], function() {
                        prompts.firstaction();
                    }))
                }).catch(() => {
                    console.log(`\nSomething went wrong... please try again.\n`);
                    process.exit(1);
                })
        });
    },

    newEmployee: () => {

        const roles = [];
        const rolesId = [];

        dataAccessLayer.select([`*`], [`role`], function(result) {
            result.forEach(element => roles.push(element.title));
            result.forEach(element => rolesId.push(element.role_id));
        });

        return new Promise((resolve, reject) => {

            inquirer
                .prompt([
                    {
                        type: `input`,
                        message: `What is the Employee's first name?`,
                        name: `firstname`
                    },
                    {
                        type: `input`,
                        message: `What is the Employee's last name?`,
                        name: `lastname`
                    },
                    {
                        type: `list`,
                        name: `role`,
                        message: `What role does this employee have?`,
                        choices: roles
                    }
                ]).then(({firstname, lastname, role}) => {

                    roleIndex = roles.indexOf(role);
                    return resolve(dataAccessLayer.create([`first_name`, `last_name`, `role_id`], [firstname, lastname, rolesId[roleIndex]], [`employee`], function() {
                        prompts.firstaction();
                    }))

                }).catch(() => {
                    console.log(`\nSomething went wrong... please try again.\n`);
                    process.exit(1);
                })
        });
    },

    updateEmployee: () => {

        const roles = [];
        const rolesId = [];

        dataAccessLayer.select([`*`], [`role`], function(result) {
            result.forEach(element => roles.push(element.title));
            result.forEach(element => rolesId.push(element.role_id));
        });

        return new Promise((resolve, reject) => {

            inquirer
                .prompt([{
                        type: `list`,
                        name: `role`,
                        message: `What role does this employee have?`,
                        choices: roles
                    }
                ]).then(({firstname, lastname, role}) => {

                    roleIndex = roles.indexOf(role);

                }).catch(() => {
                    console.log(`\nSomething went wrong... please try again.\n`);
                    process.exit(1);
                })
        });
    }

}

const mainMenu = (returnedInput) => {
    return new Promise((resolve, reject) => {
        switch (returnedInput) {
            case `View Departments`:

                dataAccessLayer.select([`*`], [`department`], function(result) {
                    console.table(result);
                    prompts.firstaction();
                });
                
                resolve();
                break;

            case `View Employees`:

                dataAccessLayer.select([`*`], [`employee`], function(result) {
                    console.table(result);
                    prompts.firstaction();
                });
                
                resolve();
                break;

            case `View Roles`:
                
                dataAccessLayer.select([`*`], [`role`], function(result) {
                    console.table(result);
                    prompts.firstaction();
                });
                resolve();
                break;

            case `Add Department`:

                prompts.newDepartment();
                break;

            case `Add Employee`:

                prompts.newEmployee();
                break;

            case `Add Role`:

                break;

            case  `Update Employee Role`:

                prompts.updateEmployee();

                break;

            case `Exit Application`:
                console.log(`Goodbye!`)
                return process.exit();        
          }
    })
}

prompts.firstaction();
