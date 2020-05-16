const Recipe = require('../../models/admin/Recipe')

module.exports = {
    index(req, res) {
        Recipe.all(function(recipes) {
            return res.render('admin/recipes/index', { recipes })
        })
    },
    create(req, res) {
        Recipe.getChefs(function(chefs) {
            return res.render('admin/recipes/create', { chefs })
        })
    },
    show(req, res) {
        const { id } = req.params
    
        Recipe.find(id, function(recipe) {
            return res.render('admin/recipes/show', { recipe })
        })
    },
    edit(req, res) {
        const { id } = req.params
        const recipe = {
            id,
            ...data[id]
        }
        
        return res.render('admin/recipes/edit', { recipe })
    },
    post(req, res) {
        const { title, image, chef, ingredients, preparation, information } = req.body

        if(!title || !chef || !ingredients || !preparation)
            return res.send('Os campos: Nome da receita, Chef, Ingredientes e Modo de preparo são obrigatórios')
        
        const recipe = {
            title,
            image,
            chef,
            ingredients,
            preparation,
            information
        }

        Recipe.create(recipe, function(recipe) {
            return res.redirect(`/admin/recipes/${recipe.id}`)
        })
    },
    put(req, res) {
        const { id, image, title, author, ingredients, preparation, information } = req.body
    
        const filteredIngredients = ingredients.filter(function(ingredient) {
            return ingredient != ''
        })
    
        const filteredSteps = preparation.filter(function(step) {
            return step != ''
        })
    
        const updatedRecipe = {
            image,
            title,
            author,
            ingredients: filteredIngredients,
            preparation: filteredSteps,
            information
        }
    
        data[id] = updatedRecipe
    
        fs.writeFile('data.json', JSON.stringify(data, null, 4), function(err) {
            if (err)
                return res.send('Erro na gravação do arquivo!')
            
            return res.json(data[id])
        })
    },
    delete(req, res) {
        const { id } = req.body
    
        data.splice(id, 1)
    
        fs.writeFile('data.json', JSON.stringify(data, null, 4), function(err) {
            if(err)
                return res.send('Erro na gravação do arquivo!')
            
            return res.redirect('/admin/recipes')
        })
    }
}