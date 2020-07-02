const Recipe = require('../../models/admin/Recipe')
const File = require('../../models/admin/File')

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
        
        Recipe.find(id, function(recipe) {
            Recipe.getChefs(function(chefs) {
                return res.render('admin/recipes/edit', { recipe, chefs })
            })
        })
    },
    async post(req, res) {
        const { title, chef, ingredients, preparation, information } = req.body
        const files = req.files

        if(files[0]) {
            const filesPromises = files.map(file => File.create(file.filename, file.path))

            await Promise.all(filesPromises)
        }

        if(!title || !chef || !ingredients || !preparation)
            return res.send('Os campos: Nome da receita, Chef, Ingredientes e Modo de preparo são obrigatórios')
        
        const recipe = {
            title,
            chef,
            ingredients,
            preparation,
            information
        }

        const result = await Recipe.create(recipe)
        return res.redirect(`/admin/recipes/${result.rows[0]}`)
    },
    put(req, res) {
        const { id, title, image, chef, ingredients, preparation, information } = req.body

        if(!title || !chef || !ingredients || !preparation)
            return res.send('Os campos: Nome da receita, Chef, Ingredientes e Modo de preparo são obrigatórios')
        
        const recipe = {
            id,
            title,
            image,
            chef,
            ingredients,
            preparation,
            information
        }

        Recipe.update(recipe, function(chef) {
            return res.redirect(`/admin/recipes/${chef.id}`)
        })
    },
    delete(req, res) {
        const { id } = req.body
    
        Recipe.delete(id, function() {
            return res.redirect('/admin/recipes')
        })
    }
}