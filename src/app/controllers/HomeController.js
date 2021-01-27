const Recipe = require('../models/Recipe')

module.exports = {
    async index(req, res) {
        let recipes = await Recipe.findRecipes({ limit: 6 })
        const filesPromises = recipes.map(recipe => Recipe.getFiles({ recipe_id: recipe.id, limit: 1 }))
        const files = await Promise.all(filesPromises)

        recipes = recipes.map((recipe, index) => {
            recipe.image = `${req.protocol}://${req.headers.host}/${files[index][0].path.replace('public\\', '').replace('\\', '/')}`
            return recipe
        })

        return res.render('public/recipes/index', { recipes })
    }
}