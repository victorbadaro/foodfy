const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/admin/User')
const Chef = require('./src/app/models/admin/Chef')
const File = require('./src/app/models/admin/File')
const Recipe = require('./src/app/models/admin/Recipe')

const totalUsers = 3
const totalChefs = 13
const totalRecipes = 12
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

    while(chefs.length < totalChefs) {
        const name = `${faker.name.firstName()} ${faker.name.lastName()}`
        const fileID = await createFile(`Avatar - ${name}`)

        chefs.push({
            name,
            file_id: fileID
        })
    }

    const chefsPromises = chefs.map(chef => Chef.create(chef))
    chefsIDs = await Promise.all(chefsPromises)
}

async function createFile(name) {
    let path = 'http://placehold.it/500x500'

    path += `?text=${name.replace('Avatar - ', '').replace(/\d/g, '').replace('-', '').replace(/-/g, ' ').replace('.jpg', '')}`

    const fileID = await File.create({
        name,
        path
    })

    return fileID
}

async function createRecipes() {
    for(let i = 0; i < totalRecipes; i++) {
        const ingredients = []
        const preparation = []
        const recipeTitle = faker.commerce.productName()
        
        for(let i = 0; i <= faker.random.number({ min: 1, max: 8 }); i++)
            ingredients.push(faker.lorem.slug())
        
        for(let i = 0; i <= faker.random.number({ min: 3, max: 5 }); i++)
            preparation.push(faker.lorem.sentence())
        
        const recipe = {
            chef: faker.random.arrayElement(chefsIDs),
            user_id: faker.random.arrayElement(usersIDs),
            title: recipeTitle,
            ingredients,
            preparation,
            information: faker.lorem.paragraph()
        }
        
        const recipeID = await Recipe.create(recipe)
        const fileID = await createFile(`${faker.time.recent()}-${recipeTitle.replace(/ /g, '-')}.jpg`)

        await Recipe.setFile(recipeID, fileID)
    }
}

async function init() {
    faker.locale = 'pt_BR'

    await createUsers()
    await createChefs()
    await createRecipes()
}

init()

// Ordem de Criação:
// 1. Users - OK
// 2. Files - OK (for chefs)
// 3. Chefs - OK
// 4. Recipes - 
// 5. Recipe Files - 