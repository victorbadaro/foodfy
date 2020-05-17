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
        let { page, limit } = req.query

        page = page || 1
        limit = limit || 6

        const offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset
        }

        Recipe.all(params, function(recipes) {
            const pagination = {
                page,
                total: recipes.length > 0 ? Math.ceil(recipes[0].total / limit) : 0
            }

            if(!filter)
                return res.render('public/recipes/recipes', { recipes, pagination })
            else
                return res.render('public/recipes/filteredRecipes', { recipes, pagination, filter })
        })
    },
    show(req, res) {
        const { id } = req.params

        Recipe.find(id, function(recipe) {
            return res.render('public/recipes/recipe', { recipe })
        })
    }
}