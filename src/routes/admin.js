const routes = require('express').Router()

const adminRecipes = require('../app/controllers/admin/recipes')
const adminChefs = require('../app/controllers/admin/chefs')
const ProfileController = require('../app/controllers/ProfileController')
const ProfileValidator = require('../app/validators/profiles')
const UserController = require('../app/controllers/UserController')
const UserValidator = require('../app/validators/users')
const multer = require('../app/middlewares/multer')

const { onlyAdmins } = require('../app/middlewares/session')

//* === ADMIN ROUTES [RECIPES and CHEFS] === *//
routes.get('/', function(req, res) {
    return res.redirect('admin/recipes')
})

// ADMIN [RECIPES]
routes.get('/recipes', adminRecipes.index)
routes.post('/recipes', multer.array('files', 5), adminRecipes.post)
routes.put('/recipes', multer.array('files', 5), adminRecipes.put)
routes.delete('/recipes', adminRecipes.delete)
routes.get('/recipes/create', adminRecipes.create)
routes.get('/recipes/:id', adminRecipes.show)
routes.get('/recipes/:id/edit', adminRecipes.edit)

// ADMIN [CHEFS]
routes.get('/chefs', adminChefs.index)
routes.post('/chefs', adminChefs.post)
routes.put('/chefs', adminChefs.put)
routes.delete('/chefs', adminChefs.delete)
routes.get('/chefs/create', onlyAdmins, adminChefs.create)
routes.get('/chefs/:id', adminChefs.show)
routes.get('/chefs/:id/edit', onlyAdmins, adminChefs.edit)

// Rotas de perfil de um usuário logado
routes.get('/profile', ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/profile', ProfileValidator.update, ProfileController.update)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/users', UserController.list) //Mostrar a lista de usuários cadastrados
routes.post('/users', UserValidator.post, UserController.post) //Cadastrar um usuário
routes.put('/users', UserValidator.update, UserController.update) // Editar um usuário
routes.delete('/users', UserValidator.delete, UserController.delete) // Deletar um usuário
routes.get('/users/create', onlyAdmins, UserController.create)
routes.get('/users/:id', onlyAdmins, UserValidator.show, UserController.show)

module.exports = routes