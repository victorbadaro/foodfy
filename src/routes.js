const express = require('express')
const adminRecipes = require('./app/controllers/admin/recipes')
const adminChefs = require('./app/controllers/admin/chefs')
const data = require('../data')
const routes = express.Router()

routes.get('/', function(req, res) {
    return res.redirect('/home')
})

routes.get('/home', function(req, res) {
    const mostAcessedRecipes = data.slice(0, 6)
    return res.render('common/index', { mostAcessedRecipes })
})

routes.get('/about', function(req, res) {
    return res.render('common/about')
})

routes.get('/recipes', function(req, res) {
    return res.render('common/recipes', { recipes: data })
})

routes.get('/recipe/:id', function(req, res) {
    const { id } = req.params
    return res.render('common/recipe', { recipe: data[id] })
})

// ADMIN ROUTES [RECIPES and CHEFS]
routes.get('/admin', function(req, res) {
    return res.redirect('/admin/recipes')
})

// ADMIN [RECIPES]
routes.get('/admin/recipes', adminRecipes.index)
routes.post('/admin/recipes', adminRecipes.post)
routes.put('/admin/recipes', adminRecipes.put)
routes.delete('/admin/recipes', adminRecipes.delete)
routes.get('/admin/recipes/create', adminRecipes.create)
routes.get('/admin/recipes/:id', adminRecipes.show)
routes.get('/admin/recipes/:id/edit', adminRecipes.edit)

// ADMIN [CHEFS]
routes.get('/admin/chefs', adminChefs.index)
routes.get('/admin/chefs/create', adminChefs.create)
routes.get('/admin/chefs/:id', adminChefs.show)
routes.get('/admin/chefs/:id/edit', adminChefs.edit)

module.exports = routes