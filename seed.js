const faker = require('faker');
const axios = require('axios');
const { hash } = require('bcryptjs');

const User = require('./src/app/models/User');
const Chef = require('./src/app/models/Chef');
const Recipe = require('./src/app/models/Recipe');
const File = require('./src/app/models/File');

const totalUsers = 3;
const totalChefs = 8;
const totalRecipes = 12;

let usersIDs = [];

async function createUsers() {
    const users = [];
    const adminPassword = await hash('1234admin', 8);
    const password = await hash('1234', 8);

    users.push({
        name: 'Foodfy Administrator',
        email: 'admin@foodfy.com',
        password: adminPassword,
        is_admin: true
    });

    while(users.length < totalUsers) {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();

        users.push({
            name: `${firstName} ${lastName}`,
            email: faker.internet.email(firstName, lastName),
            password,
            is_admin: false
        });
    }

    const usersPromises = users.map(user => User.create(user));
    usersIDs = await Promise.all(usersPromises);
}

async function createChefs() {
    const chefs = [];

    while(chefs.length < totalChefs) {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();

        const fileID = {
            name: `Avatar - ${firstName} ${lastName}`,
            path: ''
        };

        chefs.push({
            name: `${firstName} ${lastName}`,
            file_id: fileID
        });
    }
}

async function createRecipes() {

}

async function init() {
    await createUsers();
    // await createChefs();
    // await createRecipes();
    console.log('Database is ready to be used now');
    console.log('Run one of the following commands in your terminal (without quotes):');
    console.log('"npm run dev" (if you want to run the app on developer mode)');
    console.log('"npm start" (if you want to run the app on production mode)');
}

init();