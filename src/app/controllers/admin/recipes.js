const fs = require('fs')
const data = require('../../../../data')

module.exports = {
    index(req, res) {
        return res.render('admin/recipes/index', { recipes: data })
    },
    create(req, res) {
        return res.render('admin/recipes/create')
    },
    show(req, res) {
        const { id } = req.params
    
        return res.render('admin/recipes/show', { recipe: data[id] })
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
        const { image, title, author, ingredients, preparation, information } = req.body
    
        const filteredIngredients = [ingredients].filter(function(ingredient) {
            return ingredient != ''
        })
    
        const filteredSteps = [preparation].filter(function(step) {
            return step != ''
        })
    
        const newRecipe = {
            image,
            title,
            author,
            ingredients: filteredIngredients,
            preparation: filteredSteps,
            information
        }
    
        data.push(newRecipe)
    
        fs.writeFile('data.json', JSON.stringify(data, null, 4), function(err) {
            if(err)
                return res.send('Erro na gravação do arquivo!')
            
            return res.redirect('/admin/recipes')
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