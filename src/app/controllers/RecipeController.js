const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    async index(req, res) {
        const { filter } = req.query;
        let { page, limit } = req.query;

        page = page || 1;
        limit = limit || 6;

        const offset = limit * (page - 1);

        let recipes = await Recipe.findRecipes({ search: filter, limit, offset });
        const filesPromises = recipes.map(recipe => Recipe.getFiles({ recipe_id: recipe.id, limit: 1 }));
        const files = await Promise.all(filesPromises);

        recipes = recipes.map(recipe => {
            const image = files.find(image => image.recipe_id === recipe.id);

            if(image)
                recipe.image = `${req.protocol}://${req.headers.host}/${image.path.replace('public\\', '').replace('\\', '/')}`;
            
            return recipe;
        });

        const pagination = {
            page,
            total: recipes.length > 0 ? Math.ceil(recipes[0].total / limit) : 0
        };

        if(!filter)
            return res.render('public/recipes/recipes', { recipes, pagination });
        else
            return res.render('public/recipes/filteredRecipes', { recipes, pagination, filter });
    },
    async show(req, res) {
        const { id } = req.params
        const recipe = await Recipe.findOne({ where: {id} })
        const chef = await Chef.findOne({ where: { id: recipe.chef_id } })

        recipe.chef_name = chef.name

        let files = await Recipe.getFiles({ recipe_id: recipe.id })

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}/${file.path.replace('public\\', '').replace('\\', '/')}`
        }))

        return res.render('public/recipes/show', { recipe, files })
    }
}