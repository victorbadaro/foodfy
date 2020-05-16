const Recipe = require('../../models/public/Recipe')

module.exports = {
    index(req, res) {
        Recipe.mostAcessed(function(recipes) {
            return res.render('public/index', { recipes })
        })
    },
    about(req, res) {
        return res.render('public/about')
    },
    showRecipes(req, res) {
        Recipe.all(function(recipes) {
            return res.render('public/recipes', { recipes })
        })
    },
    show(req, res) {
        const { id } = req.params

        Recipe.find(id, function(recipe) {
            return res.render('public/recipe', { recipe })
        })
    }
}