const Recipe = require('../../models/public/Recipe')

module.exports = {
    index(req, res) {
        Recipe.mostAcessed(function(recipes) {
            return res.render('public/recipes/index', { recipes })
        })
    },
    about(req, res) {
        return res.render('public/about')
    },
    showRecipes(req, res) {
        const { filter } = req.query

        Recipe.all(filter, function(recipes) {
            if(!filter)
                return res.render('public/recipes/recipes', { recipes })
            else
                return res.render('public/recipes/filteredRecipes', { recipes, filter })
        })
    },
    show(req, res) {
        const { id } = req.params

        Recipe.find(id, function(recipe) {
            return res.render('public/recipes/recipe', { recipe })
        })
    }
}