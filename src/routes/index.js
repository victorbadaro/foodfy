const { Router } = require('express')
const publicRecipes = require('./app/controllers/public/recipes')
const publicChefs = require('./app/controllers/public/chefs')
const adminRecipes = require('./app/controllers/admin/recipes')
const adminChefs = require('./app/controllers/admin/chefs')
const multer = require('./app/middlewares/multer')
const { array } = require('./app/middlewares/multer')
const routes = Router()

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
routes.put('/admin/profile', ProfileController.put)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/admin/users', UserController.list) //Mostrar a lista de usuários cadastrados
routes.post('/admin/users', UserController.post) //Cadastrar um usuário
routes.put('/admin/users', UserController.put) // Editar um usuário
routes.delete('/admin/users', UserController.delete) // Deletar um usuário

routes.use((req, res) => {
    return res.render('public/not-found')
})

module.exports = routes