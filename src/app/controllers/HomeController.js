const Recipe = require('../models/Recipe')

module.exports = {
    async index(req, res) {
        let recipes = await Recipe.findRecipes({ limit: 6 })
        const filesPromises = recipes.map(recipe => Recipe.getFiles({ recipe_id: recipe.id, limit: 1 }))
        const files = await Promise.all(filesPromises)

        recipes = recipes.map(recipe => {
            const image = files.find(image => image.recipe_id === recipe.id)

            if(image)
                recipe.image = `${req.protocol}://${req.headers.host}/${image.path.replace('public\\', '').replace('\\', '/')}`
            
            return recipe
        })

        return res.render('public/recipes/index', { recipes })
    },
    about(req, res) {
        return res.render('public/about')
    }
}