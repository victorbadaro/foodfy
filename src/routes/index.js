const routes = require('express').Router()
const publicRecipes = require('../app/controllers/public/recipes')
const publicChefs = require('../app/controllers/public/chefs')
const adminRecipes = require('../app/controllers/admin/recipes')
const adminChefs = require('../app/controllers/admin/chefs')
const ProfileController = require('../app/controllers/ProfileController')
const ProfileValidator = require('../app/validators/profiles')
const UserController = require('../app/controllers/UserController')
const UserValidator = require('../app/validators/users')
const SessionController = require('../app/controllers/SessionController')
const SessionValidator = require('../app/validators/session')
const multer = require('../app/middlewares/multer')

const { onlyUsers, onlyAdmins } = require('../app/middlewares/session')

//* === PUBLIC ROUTES [RECIPES and CHEFS] === *//
routes.get('/', function(req, res) {
    return res.redirect('/home')
})
routes.get('/home', publicRecipes.index)
routes.get('/about', publicRecipes.about)

// PUBLIC [RECIPES]
routes.get('/recipes', publicRecipes.showRecipes)
routes.get('/recipes/:id', publicRecipes.show)

// PUBLIC [CHEFS]
routes.get('/chefs', publicChefs.index)

//* === ADMIN ROUTES [RECIPES and CHEFS] === *//
routes.get('/admin', function(req, res) {
    return res.redirect('/admin/recipes')
})

// ADMIN [RECIPES]
routes.get('/admin/recipes', adminRecipes.index)
routes.post('/admin/recipes', multer.array('files', 5), adminRecipes.post)
routes.put('/admin/recipes', multer.array('files', 5), adminRecipes.put)
routes.delete('/admin/recipes', adminRecipes.delete)
routes.get('/admin/recipes/create', adminRecipes.create)
routes.get('/admin/recipes/:id', adminRecipes.show)
routes.get('/admin/recipes/:id/edit', adminRecipes.edit)

// ADMIN [CHEFS]
routes.get('/admin/chefs', adminChefs.index)
routes.post('/admin/chefs', adminChefs.post)
routes.put('/admin/chefs', adminChefs.put)
routes.delete('/admin/chefs', adminChefs.delete)
routes.get('/admin/chefs/create', adminChefs.create)
routes.get('/admin/chefs/:id', adminChefs.show)
routes.get('/admin/chefs/:id/edit', adminChefs.edit)

// Rotas de perfil de um usuário logado
routes.get('/admin/profile', ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/admin/profile', ProfileValidator.update, ProfileController.update)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/admin/users', onlyUsers, UserController.list) //Mostrar a lista de usuários cadastrados
routes.post('/admin/users', UserValidator.post, UserController.post) //Cadastrar um usuário
routes.put('/admin/users', UserValidator.update, UserController.update) // Editar um usuário
routes.delete('/admin/users', UserValidator.delete, UserController.delete) // Deletar um usuário
routes.get('/admin/users/create', onlyAdmins, UserController.create)

routes.get('/admin/users/login', SessionController.loginForm)
routes.post('/admin/users/login', SessionValidator.login, SessionController.login)
routes.post('/admin/users/logout', SessionController.logout)

routes.get('/admin/users/forgot-password', SessionController.forgotForm)
routes.get('/admin/users/:id', onlyAdmins, UserValidator.show, UserController.show)

routes.use((req, res) => {
    return res.render('public/not-found')
})

module.exports = routes