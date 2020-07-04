const Recipe = require('../../models/public/Recipe')

module.exports = {
    async index(req, res) {
        let result = ''
        const settedRecipes = []

        result = await Recipe.mostAcessed()
        const recipes = result.rows

        for(let recipe of recipes) {
            result = await Recipe.getFiles(recipe.id)
            const files = result.rows

            if(files.length > 0) {
                settedRecipes.push({
                    ...recipe,
                    image: `${req.protocol}://${req.headers.host}/${files[0].path.replace('public\\', '')}`
                })
            }
        }

        return res.render('public/recipes/index', { recipes: settedRecipes })
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
                image: `${req.protocol}://${req.headers.host}/${files[0].path.replace('public\\', '')}`
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
            src: `${req.protocol}://${req.headers.host}/${file.path.replace('public\\', '')}`
        }))

        return res.render('public/recipes/show', { recipe, files })
    }
}