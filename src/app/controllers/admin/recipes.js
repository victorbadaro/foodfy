const fs = require('fs')
const data = require('../../../../data')

exports.index = function(req, res) {
    return res.render('recipes/index', { recipes: data })
}

exports.create = function(req, res) {
    return res.render('recipes/create')
}

exports.show = function(req, res) {
    const { id } = req.params

    return res.render('recipes/show', { recipe: data[id] })
}

exports.edit = function(req, res) {
    const { id } = req.params
    const recipe = {
        id,
        ...data[id]
    }
    
    return res.render('recipes/edit', { recipe })
}

exports.post = function(req, res) {
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
}

exports.put = function(req, res) {
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
}

exports.delete = function(req, res) {
    const { id } = req.body

    data.splice(id, 1)

    fs.writeFile('data.json', JSON.stringify(data, null, 4), function(err) {
        if(err)
            return res.send('Erro na gravação do arquivo!')
        
        return res.redirect('/admin/recipes')
    })
}