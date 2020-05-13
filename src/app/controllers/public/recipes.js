const data = require('../../../../data')

module.exports = {
    index(req, res) {
        const mostAcessedRecipes = data.slice(0, 6)
        return res.render('public/index', { mostAcessedRecipes })
    },
    about(req, res) {
        return res.render('public/about')
    },
    showRecipes(req, res) {
        return res.render('public/recipes', { recipes: data })
    },
    show(req, res) {
        const { id } = req.params
        return res.render('public/recipe', { recipe: data[id] })
    }
}