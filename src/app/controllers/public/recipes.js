// const Recipe = require('../../models/public/Recipe')
const Recipe = require('../../models/Recipe')

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
    },
    about(req, res) {
        return res.render('public/about')
    },
    async showRecipes(req, res) {
        const { filter } = req.query
        const settedRecipes = []
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

        let result = await Recipe.all(params)
        const recipes = result.rows

        const pagination = {
            page,
            total: recipes.length > 0 ? Math.ceil(recipes[0].total / limit) : 0
        }

        for(let recipe of recipes) {
            result = await Recipe.getFiles(recipe.id)
            const files = result.rows

            settedRecipes.push({
                ...recipe,
                image: `${req.protocol}://${req.headers.host}/${files[0].path.replace('public\\', '').replace('\\', '/')}`
            })
        }

        if(!filter)
            return res.render('public/recipes/recipes', { recipes: settedRecipes, pagination })
        else
            return res.render('public/recipes/filteredRecipes', { recipes: settedRecipes, pagination, filter })
    },
    async show(req, res) {
        const { id } = req.params
        
        let result = await Recipe.find(id)
        const recipe = result.rows[0]

        result = await Recipe.getFiles(recipe.id)
        let files = result.rows

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}/${file.path.replace('public\\', '').replace('\\', '/')}`
        }))

        return res.render('public/recipes/show', { recipe, files })
    }
}