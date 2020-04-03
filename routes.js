const express = require('express')
const data = require('./data')
const routes = express.Router()

routes.get('/', function(req, res) {
    return res.redirect('/home')
})

routes.get('/home', function(req, res) {
    const mostAcessedRecipes = data.slice(0, 6)
    return res.render('index', { mostAcessedRecipes })
})

routes.get('/about', function(req, res) {
    return res.render('about')
})

routes.get('/recipes', function(req, res) {
    return res.render('recipes', { recipes: data })
})

routes.get('/recipe/:id', function(req, res) {
    const { id } = req.params
    return res.render('recipe', { recipe: data[id] })
})

module.exports = routes