const faker = require('faker');
const { hash } = require('bcryptjs');

const User = require('./src/app/models/User');
const Chef = require('./src/app/models/Chef');
const Recipe = require('./src/app/models/Recipe');
const File = require('./src/app/models/File');

const totalUsers = 3;
const totalChefs = 8;
const totalRecipes = 12;

let usersIDs = [];
let chefsIDs = [];

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
    let chefs = [];
    const files = [];
    const unsplashCollections = ['1828614','90910022','2524063','11487784','1502261','1156865','1661892','3838904'];
    let counter = 0;

    while(chefs.length < totalChefs) {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();

        files.push({
            name: `Avatar - ${firstName} ${lastName}`,
            path: `https://source.unsplash.com/collection/${unsplashCollections[counter]}`
        });
        
        counter ++;

        chefs.push({
            name: `${firstName} ${lastName}`
        });
    }

    const filesIDsPromises = files.map(file => File.create(file));
    const filesIDs = await Promise.all(filesIDsPromises);

    chefs = chefs.map((chef, index) => {
        chef.file_id = filesIDs[index];
        return chef;
    });

    const chefsPromises = chefs.map(chef => Chef.create(chef));
    chefsIDs = await Promise.all(chefsPromises);
}

async function createRecipes() {
    const recipes = [];
    const files = [
        'photo-1540809729-52158015e13d.jpg',
        'photo-1542986130-d0c46350cf30.jpg',
        'photo-1543339308-43e59d6b73a6.jpg',
        'photo-1543353071-c953d88f7033.jpg',
        'photo-1547592166-23ac45744acd.jpg',
        'photo-1547928578-bca3e9c5a0ab.jpg',
        'photo-1550304943-4f24f54ddde9.jpg',
        'photo-1557965983-f580847ec2d1.jpg',
        'photo-1469307670224-ee31d24b6b9a.jpg',
        'photo-1514910103003-aa6b5e4239ad.jpg',
        'photo-1517741991040-91338b176129.jpg',
        'photo-1521354414378-fcffad1d3d6a.jpg',
        'photo-1528712306091-ed0763094c98.jpg',
        'photo-1534534422654-30527b9703a5.jpg',
        'photo-1540713177942-51e3d015b449.jpg',
        'photo-1567575990843-105a1c70d76e.jpg',
        'photo-1570081457388-6b3d1cc102d7.jpg',
        'photo-1570197571499-166b36435e9f.jpg',
        'photo-1584079822534-ded0800c615a.jpg',
        'photo-1585531742370-fb3554011c73.jpg',
        'photo-1586111893496-8f91022df73a.jpg',
        'photo-1587052267175-8074af64fb0c.jpg',
        'photo-1590841609987-4ac211afdde1.jpg',
        'photo-1598276223578-f16e0efa9920.jpg'
    ];

    while(recipes.length < totalRecipes) {
        const ingredients = [];
        const preparation = [];

        for(let i = 0; i < faker.random.number(7) + 1; i++)
            ingredients.push(faker.lorem.word());
        
        for(let i = 0; i < faker.random.number(3) + 1; i++)
            preparation.push(faker.lorem.sentence());

        recipes.push({
            title: `${faker.lorem.word()} ${faker.lorem.word()}`,
            chef_id: faker.random.arrayElement(chefsIDs),
            user_id: faker.random.arrayElement(usersIDs),
            ingredients,
            preparation,
            information: faker.lorem.paragraph()
        });
    }

    const recipesPromises = recipes.map(recipe => Recipe.create(recipe));
    const recipesIDs = await Promise.all(recipesPromises);

    const filesPromises = files.map(file => File.create({ name: file, path: `public\\img\\${file}`}));
    const filesIDs = await Promise.all(filesPromises);

    const recipesFilesPromises = [];
    let count = 0;

    recipesIDs.forEach(recipeID => {
        recipesFilesPromises.push(Recipe.setFile({ recipe_id: recipeID, file_id: filesIDs[count] }));
        count ++;

        recipesFilesPromises.push(Recipe.setFile({ recipe_id: recipeID, file_id: filesIDs[count] }));
        count ++;
    });

    await Promise.all(recipesFilesPromises);
}

async function init() {
    await createUsers();
    await createChefs();
    await createRecipes();

    console.log('Database is ready to be used now');
    console.log('Run one of the following commands on your terminal (without quotes):');
    console.log('"npm run dev" (if you want to run the app on developer mode)');
    console.log('"npm start" (if you want to run the app on production mode)');
}

init();