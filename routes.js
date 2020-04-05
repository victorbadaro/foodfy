const express = require('express')
const recipes = require('./controllers/recipes')
const data = require('./data')
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

routes.get('/admin', function(req, res) {
    return res.redirect('/admin/recipes')
})
routes.get('/admin/recipes', recipes.index); // Mostrar a lista de receitas
routes.get('/admin/recipes/create', recipes.create); // Mostrar formulário de nova receita
routes.get('/admin/recipes/:id', recipes.show); // Exibir detalhes de uma receita
routes.get('/admin/recipes/:id/edit', recipes.edit); // Mostrar formulário de edição de receita

routes.post('/admin/recipes', recipes.post); // Cadastrar nova receita
routes.put('/admin/recipes', recipes.put); // Editar uma receita
routes.delete('/admin/recipes', recipes.delete); // Deletar uma receita

module.exports = routes