const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/admin/User')
const Chef = require('./src/app/models/admin/Chef')
const File = require('./src/app/models/admin/File')

const { date } = require('./src/lib/utils')

const totalUsers = 3
const totalChefs = 13
let usersIDs = []
let chefsIDs = []

async function createUsers() {
    const users = []
    const password = await hash('1234', 8)

    // ADMIN
    users.push({
        name: 'Foodfy Administrator',
        email: 'admin@foodfy.com.br',
        password,
        is_admin: true,
        reset_token: '',
        reset_token_expires: ''
    })

    // OTHER USERS
    while(users.length < totalUsers) {
        users.push({
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            email: faker.internet.email(),
            password,
            is_admin: false,
            reset_token: '',
            reset_token_expires: ''
        })
    }

    const usersPromises = users.map(user => User.create(user))
    usersIDs = await Promise.all(usersPromises)
}

async function createChefs() {
    const chefs = []

    // {
    //     name,
    //     file_id,
    //     date(Date.now()).isoDate
    // }

    while(chefs.length < totalChefs) {
        chefs.push({
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            file_id: null,
            created_at: date(Date.now()).isoDate
        })
    }

    const chefsPromises = chefs.map(chef => Chef.create(chef))
    chefsIDs = await Promise.all(chefsPromises)
}

async function createFile(name) {
    // {
    //     name,
    //     path
    // }

    const fileID = await File.create({
        name,
        path: faker
    })
}

async function init() {
    // await createUsers()
    // await createChefs()

    // console.log(usersIDs)
    // console.log(chefsIDs)
    console.log(faker.image.avatar());
}

init()

// Ordem de Criação:
// 1. Users - OK
// 2. Files - 
// 3. Chefs - 
// 4. Recipes - 
// 5. Recipe Files - 